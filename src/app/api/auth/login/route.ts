import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as userRepo from '@/lib/repositories/user.repository';
import { comparePassword, generateToken } from '@/lib/auth';
import { serialize } from 'cookie';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Please provide email and password' },
                { status: 400 }
            );
        }

        const user = await userRepo.findUserByEmail(email, true); // Include password

        if (!user) {
            const { sendMail } = await import('@/lib/mail');
            await sendMail(
                'Failed Admin Login Attempt',
                `<p>Failed login attempt for email: <strong>${email}</strong> (User not found) at ${new Date().toLocaleString()}.</p>`,
                'login@analyticsdev.xyz'
            );
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isMatch = await comparePassword(password, user.password!);

        if (!isMatch) {
            const { sendMail } = await import('@/lib/mail');
            await sendMail(
                'Failed Admin Login Attempt',
                `<p>Failed login attempt for email: <strong>${email}</strong> (Incorrect password) at ${new Date().toLocaleString()}.</p>`,
                'login@analyticsdev.xyz'
            );
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = generateToken({ userId: user.id.toString(), role: user.role });

        const cookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            sameSite: 'strict',
            path: '/',
        });

        // Send Success Login Notification
        const { sendMail } = await import('@/lib/mail');
        if (process.env.NODE_ENV === 'production' || true) { // Always send for now as requested
            await sendMail(
                'Admin Login Successful',
                `<p>Admin user <strong>${email}</strong> successfully logged in at ${new Date().toLocaleString()}.</p>`,
                'login@analyticsdev.xyz'
            );
        }

        return NextResponse.json(
            { success: true, user: { name: user.name, email: user.email, role: user.role } },
            {
                status: 200,
                headers: { 'Set-Cookie': cookie },
            }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
