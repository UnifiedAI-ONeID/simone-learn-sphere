
import { z } from 'zod';

// Simple validation functions that are more permissive
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name: string) => {
  // Allow most characters, just prevent obvious attacks
  const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i];
  return !dangerousPatterns.some(pattern => pattern.test(name));
};

export const signInSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .refine(validateEmail, 'Please enter a valid email address'),
  password: z.string()
    .min(1, 'Password is required'),
});

export const signUpSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .max(254, 'Email is too long')
    .refine(validateEmail, 'Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password is too long'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long')
    .refine(validateName, 'First name contains invalid characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long')
    .refine(validateName, 'Last name contains invalid characters'),
  role: z.enum(['student', 'educator'], {
    required_error: 'Please select a role',
  }),
});

export const profileUpdateSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters long')
    .max(50, 'First name is too long')
    .refine(validateName, 'First name contains invalid characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters long')
    .max(50, 'Last name is too long')
    .refine(validateName, 'Last name contains invalid characters'),
  bio: z.string()
    .max(500, 'Bio is too long')
    .optional()
    .refine((value) => {
      if (!value) return true;
      const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i];
      return !dangerousPatterns.some(pattern => pattern.test(value));
    }, 'Bio contains invalid content'),
});

export const passwordResetSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .refine(validateEmail, 'Please enter a valid email address'),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters long')
    .max(128, 'Password is too long'),
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
