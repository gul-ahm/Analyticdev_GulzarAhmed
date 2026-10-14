import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as userRepo from '@/lib/repositories/user.repository';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and new password required' }, { status: 400 });
        }

        const user = await userRepo.findUserByResetToken(token);

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        // Update password
        const hashedPassword = await hashPassword(password);
        await userRepo.updateUser(user.id, { password: hashedPassword });

        // Clear token
        await userRepo.clearResetToken(user.id);

        return NextResponse.json({ success: true, message: 'Password reset successfully' });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
