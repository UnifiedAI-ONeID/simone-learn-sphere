
import { z } from 'zod';
import { validateSecureInput } from '@/utils/enhancedSecurityHeaders';

// Enhanced password validation with security checks
const enhancedPasswordValidation = (value: string) => {
  const securityValidation = validateSecureInput(value, 'password');
  if (!securityValidation.isValid) {
    throw new Error(securityValidation.errors.join(', '));
  }
  return value;
};

// Enhanced email validation with security checks
const enhancedEmailValidation = (value: string) => {
  const securityValidation = validateSecureInput(value, 'email');
  if (!securityValidation.isValid) {
    throw new Error(securityValidation.errors.join(', '));
  }
  return value;
};

// Enhanced name validation with security checks
const enhancedNameValidation = (value: string) => {
  const securityValidation = validateSecureInput(value, 'name');
  if (!securityValidation.isValid) {
    throw new Error(securityValidation.errors.join(', '));
  }
  return value;
};

export const signInSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .transform(enhancedEmailValidation),
  password: z.string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

export const signUpSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email is too long')
    .transform(enhancedEmailValidation),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
    .transform(enhancedPasswordValidation),
  firstName: z.string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters long')
    .max(50, 'First name is too long')
    .transform(enhancedNameValidation),
  lastName: z.string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters long')
    .max(50, 'Last name is too long')
    .transform(enhancedNameValidation),
  role: z.enum(['student', 'educator'], {
    required_error: 'Please select a role',
  }),
});

// Enhanced profile update schema
export const profileUpdateSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters long')
    .max(50, 'First name is too long')
    .transform(enhancedNameValidation),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters long')
    .max(50, 'Last name is too long')
    .transform(enhancedNameValidation),
  bio: z.string()
    .max(500, 'Bio is too long')
    .optional()
    .transform((value) => {
      if (!value) return value;
      const securityValidation = validateSecureInput(value, 'text');
      if (!securityValidation.isValid) {
        throw new Error('Bio contains invalid content');
      }
      return value;
    }),
});

// Password reset schema
export const passwordResetSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .transform(enhancedEmailValidation),
});

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters long')
    .max(128, 'Password is too long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)')
    .transform(enhancedPasswordValidation),
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
