
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
        'zh-CN': {
          'Welcome to SimoneLabs': '欢迎来到 SimoneLabs',
          'Start Learning Today': '今天开始学习',
          'Get Started Free': '免费开始',
          'Continue Learning': '继续学习',
          'Student Dashboard': '学生仪表板',
          'Admin Dashboard': '管理员仪表板',
          'Educator Dashboard': '教育者仪表板',
          'My Courses': '我的课程',
          'Achievements': '成就',
          'Learning Time': '学习时间',
          'Lessons Completed': '已完成课程',
          'Course Master': '课程大师',
          'Week Warrior': '周战士',
          'Consistent Learner': '持续学习者',
          'First Lesson Complete': '第一课完成',
          'Metrics': '指标',
          'Users': '用户',
          'Security': '安全',
          'Settings': '设置',
          'Administrator': '管理员',
          'Educator': '教育者',
          'Student': '学生',
          'Sign Out': '退出',
          'Signing Out...': '正在退出...',
          'Logout': '登出',
          'Continue': '继续',
          'Review': '复习',
          'Progress': '进度',
          'lessons': '课程',
          'Instructor': '讲师',
          'Completed': '已完成',
          'Active courses': '活跃课程',
          'This month': '本月',
          'Across all courses': '所有课程',
          'Continue learning from where you left off': '从您上次停止的地方继续学习',
          'Courses Enrolled': '已注册课程',
          'Hours Learned': '学习小时数',
          'Certificates': '证书',
          'Average Progress': '平均进度',
          'Admin Impersonation Active': '管理员模拟用户已激活',
          'You are viewing as': '您正在以此身份查看',
          'End Impersonation': '结束模拟',
          'Manage platform operations, users, and security': '管理平台操作、用户和安全',
          'Manage your courses and track your success': '管理您的课程并跟踪您的成功',
          'Continue your learning journey': '继续您的学习之旅',
        },
        'zh-TW': {
          'Welcome to SimoneLabs': '歡迎來到 SimoneLabs',
          'Start Learning Today': '今天開始學習',
          'Get Started Free': '免費開始',
          'Continue Learning': '繼續學習',
          'Student Dashboard': '學生儀表板',
          'Admin Dashboard': '管理員儀表板',
          'Educator Dashboard': '教育者儀表板',
          'My Courses': '我的課程',
          'Achievements': '成就',
          'Learning Time': '學習時間',
          'Lessons Completed': '已完成課程',
          'Course Master': '課程大師',
          'Week Warrior': '週戰士',
          'Consistent Learner': '持續學習者',
          'First Lesson Complete': '第一課完成',
          'Metrics': '指標',
          'Users': '用戶',
          'Security': '安全',
          'Settings': '設置',
          'Administrator': '管理員',
          'Educator': '教育者',
          'Student': '學生',
          'Sign Out': '退出',
          'Signing Out...': '正在退出...',
          'Logout': '登出',
          'Continue': '繼續',
          'Review': '複習',
          'Progress': '進度',
          'lessons': '課程',
          'Instructor': '講師',
          'Completed': '已完成',
          'Active courses': '活躍課程',
          'This month': '本月',
          'Across all courses': '所有課程',
          'Continue learning from where you left off': '從您上次停止的地方繼續學習',
          'Courses Enrolled': '已註冊課程',
          'Hours Learned': '學習小時數',
          'Certificates': '證書',
          'Average Progress': '平均進度',
          'Admin Impersonation Active': '管理員模擬用戶已激活',
          'You are viewing as': '您正在以此身份查看',
          'End Impersonation': '結束模擬',
          'Manage platform operations, users, and security': '管理平台操作、用戶和安全',
          'Manage your courses and track your success': '管理您的課程並跟踪您的成功',
          'Continue your learning journey': '繼續您的學習之旅',
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
