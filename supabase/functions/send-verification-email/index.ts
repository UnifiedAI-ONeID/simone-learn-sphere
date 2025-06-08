
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
  firstName?: string;
  lastName?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName }: RequestBody = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store verification code with 24-hour expiration
    const { error: storeError } = await supabase
      .from('verification_codes')
      .insert({
        email,
        code,
        action: 'email_verification',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        used: false
      });

    if (storeError) {
      console.error('Error storing verification code:', storeError);
      throw new Error('Failed to store verification code');
    }

    // In production, integrate with your email service (Resend, SendGrid, etc.)
    console.log(`Email verification code for ${email}: ${code}`);
    
    const emailSubject = 'Verify your SimoneLabs account';
    const emailBody = `
      Hi ${firstName || 'there'}!
      
      Welcome to SimoneLabs! Please verify your email address by entering this code:
      
      ${code}
      
      This code will expire in 24 hours.
      
      If you didn't create this account, please ignore this email.
      
      Best regards,
      The SimoneLabs Team
    `;

    console.log(`Email would be sent to ${email}:`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body: ${emailBody}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification email sent successfully',
        // In development, include the code for testing
        ...(Deno.env.get('DENO_ENV') === 'development' && { code })
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-verification-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send verification email' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
