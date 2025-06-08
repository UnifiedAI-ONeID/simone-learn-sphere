
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  text: string;
  targetLanguage: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage }: RequestBody = await req.json();

    if (!text || !targetLanguage) {
      throw new Error('Text and target language are required');
    }

    // Skip translation for English
    if (targetLanguage === 'en') {
      return new Response(
        JSON.stringify({ translatedText: text }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const googleTranslateApiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
    
    if (!googleTranslateApiKey) {
      console.log(`Translation would be: "${text}" to ${targetLanguage}`);
      return new Response(
        JSON.stringify({ 
          translatedText: text,
          note: 'Translation service not configured'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${googleTranslateApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          format: 'text'
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Translation API error: ${errorText}`);
    }

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;

    return new Response(
      JSON.stringify({ translatedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in translate-text-fixed function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Translation failed',
        translatedText: req.body?.text || 'Translation unavailable'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 to avoid breaking the UI
      }
    );
  }
});
