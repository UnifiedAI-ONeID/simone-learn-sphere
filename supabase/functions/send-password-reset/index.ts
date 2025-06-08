
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: RequestBody = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if user exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name')
      .eq('email', email)
      .single();

    if (!profile) {
      // Don't reveal if email exists or not for security
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'If an account with this email exists, a password reset link has been sent.'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Generate a secure reset token
    const resetToken = crypto.randomUUID();
    
    // Store reset token with 1-hour expiration
    const { error: storeError } = await supabase
      .from('verification_codes')
      .insert({
        email,
        code: resetToken,
        action: 'password_reset',
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        used: false
      });

    if (storeError) {
      console.error('Error storing reset token:', storeError);
      throw new Error('Failed to generate reset token');
    }

    // In production, integrate with your email service
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    const emailSubject = 'Reset your SimoneLabs password';
    const resetUrl = `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify?token=${resetToken}&type=recovery&redirect_to=${Deno.env.get('SITE_URL')}/auth/reset-password`;
    const emailBody = `
      Hi ${profile.first_name || 'there'}!
      
      You requested to reset your password for your SimoneLabs account.
      
      Click the link below to reset your password:
      ${resetUrl}
      
      Or use this reset code: ${resetToken}
      
      This link will expire in 1 hour.
      
      If you didn't request this reset, please ignore this email.
      
      Best regards,
      The SimoneLabs Team
    `;

    console.log(`Email would be sent to ${email}:`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body: ${emailBody}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'If an account with this email exists, a password reset link has been sent.',
        // In development, include the token for testing
        ...(Deno.env.get('DENO_ENV') === 'development' && { resetToken })
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-password-reset function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send password reset email' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
