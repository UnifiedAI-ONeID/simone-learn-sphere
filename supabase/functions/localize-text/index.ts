
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage } = await req.json();

    console.log('Localize-text function called with:', { 
      textLength: text?.length, 
      targetLanguage,
      hasOpenAIKey: !!openAIApiKey,
      timestamp: new Date().toISOString()
    });

    if (!text || !targetLanguage) {
      console.error('Missing required parameters:', { text: !!text, targetLanguage: !!targetLanguage });
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let localizedText = text;

    if (!openAIApiKey) {
      console.warn('OPENAI_API_KEY not found, returning original text');
      return new Response(
        JSON.stringify({ localizedText: text }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (targetLanguage !== 'en') {
      const languageNames = {
        'zh-CN': 'Simplified Chinese',
        'zh-TW': 'Traditional Chinese',
        'tl': 'Tagalog',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'ja': 'Japanese',
        'ko': 'Korean',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ar': 'Arabic',
        'hi': 'Hindi',
        'en': 'English'
      };

      const targetLanguageName = languageNames[targetLanguage] || targetLanguage;

      console.log('Calling OpenAI API for translation to:', targetLanguageName);

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a professional localization specialist for educational platforms. Localize text accurately while preserving:
                - Technical terminology
                - Educational context
                - UI/UX terminology
                - Cultural appropriateness
                - Formatting and structure
                
                Provide natural, contextually appropriate localization that feels native to speakers of the target language.
                Only respond with the localized text, no explanations or additional content.`
              },
              {
                role: 'user',
                content: `Localize the following text to ${targetLanguageName}:\n\n${text}`
              }
            ],
            temperature: 0.1,
            max_tokens: 2000,
          }),
        });

        console.log('OpenAI API response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          localizedText = data.choices[0].message.content.trim();
          console.log('OpenAI translation successful, result length:', localizedText.length);
        } else {
          const errorText = await response.text();
          console.error('OpenAI API error:', response.status, response.statusText);
          console.error('OpenAI error details:', errorText);
          
          // Return original text on API failure
          localizedText = text;
        }
      } catch (openAIError) {
        console.error('OpenAI request failed:', openAIError);
        // Return original text on request failure
        localizedText = text;
      }
    }

    console.log('Returning localized text (length):', localizedText.length);

    return new Response(
      JSON.stringify({ localizedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Localization function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
