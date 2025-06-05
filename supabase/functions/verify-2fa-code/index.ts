
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
  code: string;
  action: 'enable_2fa' | 'login_verification';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code, action }: RequestBody = await req.json();

    if (!email || !code || !action) {
      throw new Error('Email, code, and action are required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the code
    const { data: verificationData, error: verifyError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('action', action)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (verifyError) {
      console.error('Error verifying code:', verifyError);
      throw new Error('Failed to verify code');
    }

    if (!verificationData || verificationData.length === 0) {
      throw new Error('Invalid or expired verification code');
    }

    // Mark the code as used
    const { error: updateError } = await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verificationData[0].id);

    if (updateError) {
      console.error('Error marking code as used:', updateError);
    }

    // Generate session token for login verification
    let sessionToken;
    if (action === 'login_verification') {
      sessionToken = crypto.randomUUID();
      
      // Store session token temporarily (you might want to use Redis or similar)
      const { error: sessionError } = await supabase
        .from('temp_session_tokens')
        .insert({
          token: sessionToken,
          email,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
        });

      if (sessionError) {
        console.error('Error storing session token:', sessionError);
      }
    }

    return new Response(
      JSON.stringify({ 
        valid: true,
        action,
        ...(sessionToken && { sessionToken })
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in verify-2fa-code function:', error);
    return new Response(
      JSON.stringify({ 
        valid: false,
        error: error.message || 'Invalid verification code' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
