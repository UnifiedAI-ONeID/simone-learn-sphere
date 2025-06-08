
export const getEnhancedSecurityHeaders = () => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://www.gstatic.com https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co https://api.openai.com https://api.ipify.org wss://*.supabase.co",
      "frame-src 'self' https://accounts.google.com",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'speaker=()',
      'fullscreen=(self)'
    ].join(', '),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'cross-origin'
  };
};

export const validateSecureInput = (input: string, type: 'email' | 'text' | 'password' | 'name'): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!input || input.trim().length === 0) {
    errors.push('Input cannot be empty');
    return { isValid: false, errors };
  }

  // Check for null bytes and control characters
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(input)) {
    errors.push('Input contains invalid characters');
  }

  // Check length limits
  const maxLengths = {
    email: 254,
    text: 1000,
    password: 128,
    name: 100
  };

  if (input.length > maxLengths[type]) {
    errors.push(`Input too long (max ${maxLengths[type]} characters)`);
  }

  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        errors.push('Invalid email format');
      }
      // Check for dangerous email patterns
      if (input.includes('..') || input.startsWith('.') || input.endsWith('.')) {
        errors.push('Invalid email format');
      }
      break;

    case 'password':
      if (input.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (!/(?=.*[a-z])/.test(input)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/(?=.*[A-Z])/.test(input)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/(?=.*\d)/.test(input)) {
        errors.push('Password must contain at least one number');
      }
      if (!/(?=.*[@$!%*?&])/.test(input)) {
        errors.push('Password must contain at least one special character');
      }
      break;

    case 'name':
      const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
      if (!nameRegex.test(input)) {
        errors.push('Name can only contain letters, spaces, hyphens, apostrophes, and periods');
      }
      if (input.length < 2) {
        errors.push('Name must be at least 2 characters long');
      }
      break;

    case 'text':
      // Check for script injection patterns
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
        /data:text\/html/i
      ];
      
      for (const pattern of dangerousPatterns) {
        if (pattern.test(input)) {
          errors.push('Input contains potentially dangerous content');
          break;
        }
      }
      break;
  }

  return { isValid: errors.length === 0, errors };
};

export const sanitizeHtmlContent = (html: string): string => {
  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove dangerous attributes
  html = html.replace(/\son\w+\s*=\s*[^>]*/gi, '');
  html = html.replace(/javascript:/gi, '');
  html = html.replace(/data:text\/html/gi, '');
  
  // Remove dangerous tags
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'];
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi');
    html = html.replace(regex, '');
  });
  
  return html;
};

export const generateSecureSessionToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const generateSessionFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Security fingerprint', 2, 2);
  }
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvas.toDataURL(),
    timestamp: Date.now()
  };
  
  return btoa(JSON.stringify(fingerprint));
};
