import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import * as contactRepo from '@/lib/repositories/contact.repository';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const conn = await dbConnect();
        if (!conn) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        const contacts = await contactRepo.findAllContactSubmissions();
        return NextResponse.json({ success: true, data: contacts }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch contact submissions' }, { status: 500 });
    }
}

import { contactSchema } from '@/lib/schemas'; // Import schema

export async function POST(req: Request) {
    try {
        await dbConnect();
        // ... inside POST ...
        const body = await req.json();

        // Zod Validation
        const validation = contactSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, error: validation.error.issues[0].message },
                { status: 400 }
            );
        }

        const contact = await contactRepo.createContactSubmission(validation.data);

        // Send Email Notification
        const emailContent = `
            <h3>New Contact Submission</h3>
            <p><strong>Name:</strong> ${body.name}</p>
            <p><strong>Email:</strong> ${body.email}</p>
            <p><strong>Subject:</strong> ${body.subject}</p>
            <p><strong>Message:</strong></p>
            <blockquote>${body.message}</blockquote>
        `;

        // Import dynamically to avoid circular deps if any (though mail.ts is safe)
        const { sendMail } = await import('@/lib/mail');
        await sendMail(`New Contact: ${body.subject}`, emailContent);

        return NextResponse.json({ success: true, data: contact }, { status: 201 });
    } catch (error: any) {
        // BRUTAL SECURITY: Don't leak stack traces in production
        console.error('Contact Submission Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error. Please contact support.' },
            { status: 500 }
        );
    }
}
