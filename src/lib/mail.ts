import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'hello@analyticsdev.xyz';

export const sendMail = async (
    subject: string,
    html: string,
    to: string = CONTACT_EMAIL
) => {
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.warn('Mail configuration missing. Skipping email send.');
        return false;
    }

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_PORT === 465, // true for 465, false for other ports
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"AnalyticsDev" <${SMTP_USER}>`,
            to,
            subject,
            html,
        });
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
};
