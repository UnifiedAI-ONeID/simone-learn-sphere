
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

    // Get user's credentials
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (!profile) {
      throw new Error('User not found');
    }

    const { data: credentials, error: credentialsError } = await supabase
      .from('webauthn_credentials')
      .select('credential_id')
      .eq('user_id', profile.id)
      .eq('is_active', true);

    if (credentialsError || !credentials || credentials.length === 0) {
      throw new Error('No passkeys found for this user');
    }

    // Generate a challenge
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const challengeBase64 = btoa(String.fromCharCode(...challenge));

    // Store the challenge temporarily
    const { error: storeError } = await supabase
      .from('temp_session_tokens')
      .insert({
        token: challengeBase64,
        email: email,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
        used: false
      });

    if (storeError) {
      console.error('Error storing challenge:', storeError);
      throw new Error('Failed to store challenge');
    }

    // Create authentication options
    const options = {
      challenge: challengeBase64,
      allowCredentials: credentials.map(cred => ({
        id: cred.credential_id,
        type: 'public-key',
      })),
      userVerification: 'preferred',
      timeout: 60000,
    };

    return new Response(
      JSON.stringify({ 
        success: true,
        options
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in webauthn-auth-challenge function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate authentication challenge' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
