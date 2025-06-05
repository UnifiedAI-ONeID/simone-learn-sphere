
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
  action: 'enable_2fa' | 'login_verification';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, action }: RequestBody = await req.json();

    if (!email || !action) {
      throw new Error('Email and action are required');
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the code with expiration (5 minutes)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store verification code in a temporary table
    const { error: storeError } = await supabase
      .from('verification_codes')
      .insert({
        email,
        code,
        action,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
        used: false
      });

    if (storeError) {
      console.error('Error storing verification code:', storeError);
      throw new Error('Failed to store verification code');
    }

    // In a real implementation, you would send the email here
    // For now, we'll log it (in production, integrate with your email service)
    console.log(`2FA Code for ${email}: ${code} (Action: ${action})`);

    // Simulate email sending
    const emailSubject = action === 'enable_2fa' 
      ? 'Enable Two-Factor Authentication' 
      : 'Login Verification Code';
    
    const emailBody = `
      Your verification code is: ${code}
      
      This code will expire in 5 minutes.
      
      If you didn't request this code, please ignore this email.
    `;

    console.log(`Email would be sent to ${email}:`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body: ${emailBody}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Verification code sent successfully',
        // In development, include the code for testing
        ...(Deno.env.get('DENO_ENV') === 'development' && { code })
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-2fa-code function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send verification code' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
