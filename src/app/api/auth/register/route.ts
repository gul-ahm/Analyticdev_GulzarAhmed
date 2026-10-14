import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as userRepo from '@/lib/repositories/user.repository';
import { hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'Please provide all fields' },
                { status: 400 }
            );
        }

        const userExists = await userRepo.findUserByEmail(email);

        if (userExists) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        await userRepo.createUser({
            name,
            email,
            password: hashedPassword,
        });

        return NextResponse.json(
            { success: true, message: 'User registered successfully' },
            { status: 201 }
        );
    } catch (error: any) {
        // MySQL duplicate entry error code
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
