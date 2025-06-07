
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userRole = 'student' } = await req.json();

    // Define role-specific system prompts
    const systemPrompts = {
      student: `You are an AI learning assistant for students. Help with:
      - Explaining complex concepts in simple terms
      - Study strategies and tips
      - Homework and assignment guidance
      - Test preparation
      - Learning motivation and encouragement
      Keep responses helpful, encouraging, and educational.`,
      
      educator: `You are an AI assistant for educators. Help with:
      - Course creation and curriculum design
      - Teaching strategies and methodologies
      - Student engagement techniques
      - Assessment and grading approaches
      - Educational technology integration
      - Classroom management tips
      Provide practical, evidence-based educational guidance.`,
      
      admin: `You are an AI assistant for educational administrators. Help with:
      - Platform management and optimization
      - User engagement strategies
      - Educational analytics insights
      - System administration guidance
      - Best practices for educational platforms
      Provide strategic and operational guidance.`
    };

    const systemPrompt = systemPrompts[userRole as keyof typeof systemPrompts] || systemPrompts.student;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-gpt function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
