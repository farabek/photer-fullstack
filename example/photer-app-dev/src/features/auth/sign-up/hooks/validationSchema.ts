import { z } from 'zod';

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(6, 'Username must be at least 6 characters')
      .max(30, 'Username must be at most 30 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and hyphens'
      ),
    email: z
      .string()
      .email('The email must match the format example@example.com'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(30, 'Maximum number of characters 30')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,30}$/,
        'Password must contain at least one lowercase letter, one uppercase letter, one digit.'
      ),
    terms: z.boolean().refine((val) => val, {
      message: 'You must accept the terms',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'The passwords must match',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
