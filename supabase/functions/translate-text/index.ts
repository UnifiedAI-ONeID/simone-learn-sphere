
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const googleTranslateApiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage, provider = 'chatgpt' } = await req.json();

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let translatedText = text;

    if (provider === 'chatgpt' && openAIApiKey) {
      // Use ChatGPT for translation
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
              content: `You are a professional translator specializing in educational content. Translate text accurately while preserving:
              - Technical terminology
              - Educational context
              - Formatting and structure
              - Cultural nuances
              
              Only respond with the translated text, no explanations or additional content.`
            },
            {
              role: 'user',
              content: `Translate the following text to ${targetLanguageName}:\n\n${text}`
            }
          ],
          temperature: 0.1,
          max_tokens: 2000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        translatedText = data.choices[0].message.content.trim();
      } else {
        console.warn('ChatGPT translation failed, falling back to Google Translate');
        // Fallback to Google Translate if available
        if (googleTranslateApiKey) {
          const fallbackResponse = await fetch(
            `https://translation.googleapis.com/language/translate/v2?key=${googleTranslateApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                q: text,
                target: targetLanguage,
                format: 'text'
              }),
            }
          );
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            translatedText = fallbackData.data.translations[0].translatedText;
          }
        }
      }
    } else if (provider === 'google' && googleTranslateApiKey) {
      // Use Google Translate
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${googleTranslateApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
            format: 'text'
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        translatedText = data.data.translations[0].translatedText;
      }
    }

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
