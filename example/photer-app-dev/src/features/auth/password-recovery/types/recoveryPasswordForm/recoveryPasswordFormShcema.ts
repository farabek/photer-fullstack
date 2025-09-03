import { z } from 'zod';

export const RecoveryPasswordFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .max(20, { message: 'Password must be at most 20 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.newPassword, {
    message: 'The passwords must match',
    path: ['confirmPassword'],
  });

export type RecoveryPasswordFormSchemaType = z.infer<
  typeof RecoveryPasswordFormSchema
>;
