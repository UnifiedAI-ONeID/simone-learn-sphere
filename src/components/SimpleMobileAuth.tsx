import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LocalizedText } from '@/components/LocalizedText';
import { PlatformButton } from '@/components/platform/PlatformButton';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { usePlatformTheme } from '@/contexts/PlatformThemeContext';

export const SimpleMobileAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { platform } = usePlatformTheme();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (error) throw error;

        toast({
          title: "Check your email",
          description: "We sent you a confirmation link.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        navigate('/student-dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PlatformCard 
      className="bg-[var(--platform-surface)]/90 backdrop-blur-sm"
      title={isSignUp ? "Create Account" : "Sign In"}
      description={isSignUp ? "Join SimoneLabs today" : "Access your mobile learning dashboard"}
    >
      <form onSubmit={handleAuth} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-[var(--platform-text-secondary)]" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`pl-10 bg-[var(--platform-background)] border-[var(--platform-border)] text-[var(--platform-text)] ${
                platform === 'ios' ? 'rounded-lg' : 
                platform === 'android' ? 'rounded-xl' : 'rounded-lg'
              }`}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-[var(--platform-text-secondary)]" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pl-10 pr-10 bg-[var(--platform-background)] border-[var(--platform-border)] text-[var(--platform-text)] ${
                platform === 'ios' ? 'rounded-lg' : 
                platform === 'android' ? 'rounded-xl' : 'rounded-lg'
              }`}
              required
            />
            <PlatformButton
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-[var(--platform-text-secondary)]" />
              ) : (
                <Eye className="h-4 w-4 text-[var(--platform-text-secondary)]" />
              )}
            </PlatformButton>
          </div>
        </div>

        <PlatformButton
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          <LocalizedText text={isLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")} />
        </PlatformButton>

        <div className="text-center">
          <PlatformButton
            type="button"
            variant="ghost"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-[var(--platform-text-secondary)] hover:text-[var(--platform-text)]"
          >
            <LocalizedText text={isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"} />
          </PlatformButton>
        </div>
      </form>
    </PlatformCard>
  );
};
