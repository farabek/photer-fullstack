import z from 'zod';

export const profileGenInfoSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    ),
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .regex(
      /^[0-9A-Za-zА-Яа-я_-]+$/,
      'First name can only contain letters (both Latin and Cyrillic), numbers, underscores, and hyphens.'
    ),
  lastName: z
    .string()
    .min(1, 'Last name must be at least 1 character')
    .max(50, 'Last name must be at most 50 characters')
    .regex(
      /^[0-9A-Za-zА-Яа-я_-]+$/,
      'Last name can only contain letters (both Latin and Cyrillic), numbers, underscores, and hyphens.'
    ),
  birthDate: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  aboutMe: z
    .string()
    .max(200, 'About me must be at most 200 characters')
    .optional(),
});

export type ProfileGenInfoSchema = z.infer<typeof profileGenInfoSchema>;
