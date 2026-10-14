import { z } from 'zod';

export const contactSchema = z.object({
    name: z.string().min(2, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(3, 'Subject must be at least 3 characters').max(200).optional().or(z.literal('')),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

export const reviewSchema = z.object({
    name: z.string().min(2, 'Name is required').max(100),
    rating: z.number().int().min(1).max(5),
    content: z.string().min(10, 'Review must be at least 10 characters').max(1000),
    role: z.string().max(100).optional(),
    company: z.string().max(100).optional(),
    image: z.string().optional().or(z.literal('')),
});

export const applicationSchema = z.object({
    name: z.string().min(2, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
    resume: z.string().url('Invalid Resume URL'),
    job: z.string().min(1, 'Job ID is required'),
});
