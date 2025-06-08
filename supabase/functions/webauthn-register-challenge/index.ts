
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  userId: string;
  email: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email }: RequestBody = await req.json();

    if (!userId || !email) {
      throw new Error('User ID and email are required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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

    // Create registration options
    const options = {
      challenge: challengeBase64,
      rp: {
        name: 'SimoneLabs',
        id: new URL(Deno.env.get('SUPABASE_URL') ?? '').hostname,
      },
      user: {
        id: userId,
        name: email,
        displayName: email,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        requireResidentKey: false,
      },
      timeout: 60000,
      attestation: 'direct',
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
    console.error('Error in webauthn-register-challenge function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate registration challenge' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
