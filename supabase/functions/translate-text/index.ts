
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage } = await req.json();

    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Text and target language are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // For demo purposes, we'll simulate translation
    // In production, you would integrate with Google Translate API or similar service
    const simulateTranslation = (text: string, lang: string): string => {
      const translations: Record<string, Record<string, string>> = {
        'zh-TW': {
          'Welcome to SimoneLabs': '歡迎來到 SimoneLabs',
          'Start Learning Today': '今天開始學習',
          'Get Started Free': '免費開始',
          'Continue Learning': '繼續學習',
          'Student Dashboard': '學生儀表板',
          'My Courses': '我的課程',
          'Achievements': '成就',
          'Learning Time': '學習時間',
          'Lessons Completed': '已完成課程',
          'Course Master': '課程大師',
          'Week Warrior': '週戰士',
          'Consistent Learner': '持續學習者',
          'First Lesson Complete': '第一課完成',
        },
        'tl': {
          'Welcome to SimoneLabs': 'Maligayang pagdating sa SimoneLabs',
          'Start Learning Today': 'Magsimula ng Pag-aaral Ngayon',
          'Get Started Free': 'Magsimula Nang Libre',
          'Continue Learning': 'Magpatuloy sa Pag-aaral',
          'Student Dashboard': 'Dashboard ng Estudyante',
          'My Courses': 'Aking mga Kurso',
          'Achievements': 'Mga Tagumpay',
          'Learning Time': 'Oras ng Pag-aaral',
          'Lessons Completed': 'Natapos na mga Aralin',
          'Course Master': 'Dalubhasa sa Kurso',
          'Week Warrior': 'Mandirigma ng Linggo',
          'Consistent Learner': 'Tuloy-tuloy na Nag-aaral',
          'First Lesson Complete': 'Unang Aralin Tapos na',
        },
        'es': {
          'Welcome to SimoneLabs': 'Bienvenido a SimoneLabs',
          'Start Learning Today': 'Comienza a Aprender Hoy',
          'Get Started Free': 'Comenzar Gratis',
          'Continue Learning': 'Continuar Aprendiendo',
          'Student Dashboard': 'Panel del Estudiante',
          'My Courses': 'Mis Cursos',
          'Achievements': 'Logros',
          'Learning Time': 'Tiempo de Aprendizaje',
          'Lessons Completed': 'Lecciones Completadas',
        },
        'fr': {
          'Welcome to SimoneLabs': 'Bienvenue chez SimoneLabs',
          'Start Learning Today': 'Commencez à Apprendre Aujourd\'hui',
          'Get Started Free': 'Commencer Gratuitement',
          'Continue Learning': 'Continuer l\'Apprentissage',
          'Student Dashboard': 'Tableau de Bord Étudiant',
          'My Courses': 'Mes Cours',
          'Achievements': 'Réalisations',
          'Learning Time': 'Temps d\'Apprentissage',
          'Lessons Completed': 'Leçons Terminées',
        }
      };

      const langTranslations = translations[lang];
      if (langTranslations && langTranslations[text]) {
        return langTranslations[text];
      }

      // Fallback: return original text with language indicator
      return `[${lang.toUpperCase()}] ${text}`;
    };

    const translatedText = simulateTranslation(text, targetLanguage);

    console.log(`Translated "${text}" to ${targetLanguage}: "${translatedText}"`);

    return new Response(
      JSON.stringify({ translatedText }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Translation error:', error);
    return new Response(
      JSON.stringify({ error: 'Translation service error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
