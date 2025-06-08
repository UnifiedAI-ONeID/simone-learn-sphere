
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TutorRequest {
  question: string;
  lessonId?: string;
  quizContext?: boolean;
}

interface IntentClassification {
  intent: 'learn' | 'cheat-attempt' | 'general' | 'inappropriate';
  confidence: number;
  reasoning: string;
}

interface LessonContext {
  title: string;
  content: string;
  key_concepts?: string[];
  summary?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, lessonId, quizContext = false }: TutorRequest = await req.json();
    
    if (!question || question.trim().length === 0) {
      throw new Error('Question is required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      throw new Error('Authentication required');
    }

    // Check if user is locked from AI abuse
    const { data: isLocked } = await supabase.rpc('is_user_ai_locked', {
      check_user_id: user.id
    });

    if (isLocked) {
      return new Response(JSON.stringify({
        success: false,
        message: "AI Tutor is temporarily unavailable for you. Please try again later or contact support.",
        locked: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429
      });
    }

    console.log(`AI Tutor request from user ${user.id}: "${question}"`);

    // Step 1: Intent Classification
    const intentClassification = await classifyIntent(question, quizContext);
    console.log('Intent classification:', intentClassification);

    // Step 2: Content Context Engine
    let lessonContext: LessonContext | null = null;
    if (lessonId) {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('title, content')
        .eq('id', lessonId)
        .single();
      
      if (lesson) {
        lessonContext = lesson;
      }
    }

    // Step 3: Moderation & Guardrails
    const moderationResult = await moderateContent(question);
    
    if (moderationResult.flagged) {
      // Log abuse
      await supabase.rpc('log_ai_abuse', {
        abuse_user_id: user.id,
        abuse_type_param: 'inappropriate_content',
        severity_param: 2
      });

      return new Response(JSON.stringify({
        success: false,
        message: "I can't help with that type of question. Let's focus on learning the course material!",
        intent: intentClassification.intent
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Handle cheat attempts
    if (intentClassification.intent === 'cheat-attempt') {
      // Log potential cheating attempt
      await supabase.rpc('log_ai_abuse', {
        abuse_user_id: user.id,
        abuse_type_param: 'cheat_attempt',
        severity_param: 1
      });

      const response = "I'm here to help you understand, not give direct answers. Would you like a hint instead? Try asking 'How does this concept work?' or 'Can you explain why this is important?'";
      
      // Log session
      await supabase.from('ai_tutor_sessions').insert({
        user_id: user.id,
        lesson_id: lessonId,
        question,
        intent_classification: intentClassification.intent,
        response,
        quiz_context: quizContext,
        moderation_flags: { cheat_attempt: true }
      });

      return new Response(JSON.stringify({
        success: true,
        response,
        intent: intentClassification.intent,
        suggestion: "Try rephrasing your question to focus on understanding the concept."
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Step 4: AI Prompt Composer & Response Generation
    const aiResponse = await generateTutorResponse(question, lessonContext, intentClassification);

    // Log successful session
    await supabase.from('ai_tutor_sessions').insert({
      user_id: user.id,
      lesson_id: lessonId,
      question,
      intent_classification: intentClassification.intent,
      response: aiResponse.explanation,
      quiz_context: quizContext,
      moderation_flags: {}
    });

    return new Response(JSON.stringify({
      success: true,
      ...aiResponse,
      intent: intentClassification.intent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in AI Tutor:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function classifyIntent(question: string, quizContext: boolean): Promise<IntentClassification> {
  const lowerQuestion = question.toLowerCase().trim();
  
  // Direct answer seeking patterns
  const cheatPatterns = [
    /what(?:'s| is) the answer/i,
    /answer to question \d+/i,
    /tell me the answer/i,
    /give me the answer/i,
    /correct answer/i,
    /solution to/i,
    /just tell me/i,
    /what should i choose/i,
    /which option is correct/i
  ];

  // Learning-oriented patterns
  const learnPatterns = [
    /why/i,
    /how does/i,
    /can you explain/i,
    /help me understand/i,
    /what does.*mean/i,
    /difference between/i,
    /example of/i,
    /how to/i,
    /what is the concept/i
  ];

  if (cheatPatterns.some(pattern => pattern.test(question))) {
    return {
      intent: 'cheat-attempt',
      confidence: 0.9,
      reasoning: 'Question seeks direct answers rather than understanding'
    };
  }

  if (learnPatterns.some(pattern => pattern.test(question))) {
    return {
      intent: 'learn',
      confidence: 0.8,
      reasoning: 'Question shows intent to understand concepts'
    };
  }

  // If in quiz context and asking specific questions, be more cautious
  if (quizContext && (lowerQuestion.includes('question') || lowerQuestion.includes('quiz'))) {
    return {
      intent: 'cheat-attempt',
      confidence: 0.7,
      reasoning: 'Quiz context with question reference suggests answer seeking'
    };
  }

  return {
    intent: 'general',
    confidence: 0.6,
    reasoning: 'General educational question'
  };
}

async function moderateContent(content: string): Promise<{ flagged: boolean; categories: string[] }> {
  if (!openAIApiKey) {
    return { flagged: false, categories: [] };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: content
      }),
    });

    if (!response.ok) {
      throw new Error(`Moderation API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.results[0];
    
    return {
      flagged: result.flagged,
      categories: Object.keys(result.categories).filter(cat => result.categories[cat])
    };
  } catch (error) {
    console.error('Moderation error:', error);
    return { flagged: false, categories: [] };
  }
}

async function generateTutorResponse(
  question: string, 
  lessonContext: LessonContext | null, 
  intent: IntentClassification
): Promise<{
  explanation: string;
  followUpQuestion?: string;
  suggestion?: string;
}> {
  if (!openAIApiKey) {
    return {
      explanation: "I'd love to help you learn! Unfortunately, I'm not fully configured right now. Please ask your instructor for assistance.",
      suggestion: "Try reviewing the lesson materials or discussing with classmates."
    };
  }

  const contextPrompt = lessonContext ? 
    `Current lesson context:\nTitle: ${lessonContext.title}\nContent summary: ${lessonContext.content?.substring(0, 500)}...\n\n` : 
    '';

  const systemPrompt = `You are a helpful educational tutor. Your goal is to guide students to understanding without giving direct answers.

${contextPrompt}Guidelines:
- Help students think critically and discover answers themselves
- Ask probing questions to guide their thinking
- Provide hints and explanations, not direct answers
- Encourage exploration and deeper understanding
- Be encouraging and supportive
- If they're stuck, offer to break down the problem into smaller parts
- Keep responses concise but helpful

Student question: ${question}

Provide your response in a helpful, educational tone that promotes learning.`;

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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const explanation = data.choices[0].message.content;

    // Generate a follow-up question to encourage deeper thinking
    const followUpPrompts = [
      "What do you think might happen if we changed one variable here?",
      "Can you think of a real-world example of this concept?",
      "How does this relate to what we learned earlier?",
      "What questions does this raise for you?",
      "Would you like to explore this concept further?"
    ];

    const followUpQuestion = followUpPrompts[Math.floor(Math.random() * followUpPrompts.length)];

    return {
      explanation,
      followUpQuestion,
      suggestion: "Feel free to ask me to clarify any part of this explanation!"
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      explanation: "I'm having trouble processing your question right now. Can you try rephrasing it or asking about a specific concept you'd like to understand better?",
      suggestion: "Try breaking your question into smaller, more specific parts."
    };
  }
}
