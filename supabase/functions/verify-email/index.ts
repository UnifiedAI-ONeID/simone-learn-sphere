
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  email: string;
  code: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code }: RequestBody = await req.json();

    if (!email || !code) {
      throw new Error('Email and code are required');
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
      .eq('action', 'email_verification')
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

    // Mark email as verified in profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ email_verified: true })
      .eq('email', email);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      throw new Error('Failed to verify email');
    }

    return new Response(
      JSON.stringify({ 
        valid: true,
        message: 'Email verified successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in verify-email function:', error);
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
