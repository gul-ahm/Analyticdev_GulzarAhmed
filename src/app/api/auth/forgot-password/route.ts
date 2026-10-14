import { NextResponse } from 'next/server';
import cryptoRandomString from 'crypto-random-string';
import dbConnect from '@/lib/db';
import * as userRepo from '@/lib/repositories/user.repository';
import { sendMail } from '@/lib/mail';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await userRepo.findUserByEmail(email);
        if (!user) {
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ success: true, message: 'If that email exists, we sent a link.' });
        }

        // Generate token
        const token = cryptoRandomString({ length: 64, type: 'url-safe' });
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await userRepo.saveResetToken(email, token, expires);

        // Send email
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`;

        await sendMail(
            'Reset Your Password - AnalyticsDev',
            `
            <p>You requested a password reset for your AnalyticsDev Admin account.</p>
            <p>Click the link below to verify your email and set a new password:</p>
            <p><a href="${resetUrl}"><strong>Reset Password</strong></a></p>
            <p>Link expires in 1 hour.</p>
            <p>If you didn't request this, purely ignore this email.</p>
            `,
            email
        );

        return NextResponse.json({ success: true, message: 'If that email exists, we sent a link.' });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
