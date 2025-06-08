
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AITutorSession {
  id: string;
  lesson_id: string | null;
  question: string;
  intent_classification: string;
  response: string;
  quiz_context: boolean;
  created_at: string;
}

export const useAITutor = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<AITutorSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const checkLockStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('is_user_ai_locked', {
        check_user_id: user.id
      });

      if (error) {
        console.error('Error checking AI lock status:', error);
        return;
      }

      setIsLocked(data || false);
    } catch (error) {
      console.error('Error checking AI lock status:', error);
    }
  };

  const fetchSessions = async (lessonId?: string) => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('ai_tutor_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching AI tutor sessions:', error);
        return;
      }

      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching AI tutor sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async (
    question: string, 
    lessonId?: string, 
    quizContext: boolean = false
  ) => {
    if (!user || isLocked) {
      throw new Error(isLocked ? 'AI Tutor is temporarily unavailable' : 'Authentication required');
    }

    if (!question.trim()) {
      throw new Error('Question cannot be empty');
    }

    try {
      const { data, error } = await supabase.functions.invoke('ai-tutor', {
        body: {
          question: question.trim(),
          lessonId,
          quizContext
        }
      });

      if (error) throw error;
      
      // Refresh sessions after asking a question
      await fetchSessions(lessonId);
      
      return data;
    } catch (error) {
      console.error('Error asking AI tutor question:', error);
      throw error;
    }
  };

  const getSessionStats = () => {
    const totalSessions = sessions.length;
    const cheatAttempts = sessions.filter(s => s.intent_classification === 'cheat-attempt').length;
    const learningQuestions = sessions.filter(s => s.intent_classification === 'learn').length;
    
    return {
      totalSessions,
      cheatAttempts,
      learningQuestions,
      cheatAttemptRate: totalSessions > 0 ? (cheatAttempts / totalSessions) * 100 : 0
    };
  };

  useEffect(() => {
    if (user) {
      checkLockStatus();
      fetchSessions();
    }
  }, [user]);

  return {
    sessions,
    loading,
    isLocked,
    askQuestion,
    fetchSessions,
    checkLockStatus,
    getSessionStats,
  };
};
