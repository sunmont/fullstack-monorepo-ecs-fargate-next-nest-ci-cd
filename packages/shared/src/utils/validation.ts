import { z } from 'zod';

// Email validation schema
export const emailSchema = z
    .string()
    .email('Invalid email address')
    .min(5, 'Email too short')
    .max(100, 'Email too long');

// Password validation schema
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password too long')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );

// Name validation schema
export const nameSchema = z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// URL validation schema
export const urlSchema = z
    .string()
    .url('Invalid URL')
    .optional()
    .or(z.literal(''));

// Pagination schema
export const paginationSchema = z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
    sortBy: z.string().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Validation helpers
export function validateEmail(email: string): boolean {
    return emailSchema.safeParse(email).success;
}

export function validatePassword(password: string): boolean {
    return passwordSchema.safeParse(password).success;
}

export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[^\w\s@.-]/gi, ''); // Remove special characters
}