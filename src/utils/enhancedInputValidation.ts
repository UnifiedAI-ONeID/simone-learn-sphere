
import { validateSecureInput } from './enhancedSecurityHeaders';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string[] };
}

export const validateForm = (data: { [key: string]: string }, schema: ValidationSchema): ValidationResult => {
  const errors: { [key: string]: string[] } = {};
  let isValid = true;

  for (const [field, value] of Object.entries(data)) {
    const rule = schema[field];
    if (!rule) continue;

    const fieldErrors: string[] = [];

    // Required validation
    if (rule.required && (!value || value.trim().length === 0)) {
      fieldErrors.push(`${field} is required`);
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim().length === 0) {
      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors;
        isValid = false;
      }
      continue;
    }

    // Length validations
    if (rule.minLength && value.length < rule.minLength) {
      fieldErrors.push(`${field} must be at least ${rule.minLength} characters`);
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      fieldErrors.push(`${field} must be no more than ${rule.maxLength} characters`);
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      fieldErrors.push(`${field} format is invalid`);
    }

    // Custom validation
    if (rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        fieldErrors.push(customError);
      }
    }

    // Security validation based on field type
    let securityType: 'email' | 'text' | 'password' | 'name' = 'text';
    if (field.toLowerCase().includes('email')) securityType = 'email';
    else if (field.toLowerCase().includes('password')) securityType = 'password';
    else if (field.toLowerCase().includes('name')) securityType = 'name';

    const securityValidation = validateSecureInput(value, securityType);
    if (!securityValidation.isValid) {
      fieldErrors.push(...securityValidation.errors);
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
      isValid = false;
    }
  }

  return { isValid, errors };
};

export const enhancedAuthSchemas = {
  signUp: {
    email: {
      required: true,
      maxLength: 254,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      minLength: 8,
      maxLength: 128,
      custom: (value: string) => {
        const requirements = [
          { test: /[a-z]/, message: 'one lowercase letter' },
          { test: /[A-Z]/, message: 'one uppercase letter' },
          { test: /\d/, message: 'one number' },
          { test: /[@$!%*?&]/, message: 'one special character' }
        ];
        
        const missing = requirements.filter(req => !req.test.test(value));
        if (missing.length > 0) {
          return `Password must contain ${missing.map(m => m.message).join(', ')}`;
        }
        return null;
      }
    },
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-'\.]+$/
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-'\.]+$/
    }
  },
  signIn: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      required: true,
      minLength: 1
    }
  },
  profile: {
    firstName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-'\.]+$/
    },
    lastName: {
      required: true,
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s\-'\.]+$/
    },
    bio: {
      maxLength: 500,
      custom: (value: string) => {
        // Check for potential XSS attempts
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i
        ];
        
        for (const pattern of dangerousPatterns) {
          if (pattern.test(value)) {
            return 'Bio contains invalid content';
          }
        }
        return null;
      }
    }
  }
};

export const sanitizeFormData = (data: { [key: string]: any }): { [key: string]: any } => {
  const sanitized: { [key: string]: any } = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove null bytes and control characters
      sanitized[key] = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};
