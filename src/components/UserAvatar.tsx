
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserAvatarProps {
  userId?: string;
  firstName?: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar = ({ 
  userId, 
  firstName = '', 
  lastName = '', 
  size = 'md',
  className = '' 
}: UserAvatarProps) => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || user?.id;

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!targetUserId) {
        setLoading(false);
        return;
      }

      try {
        // Get the user's profile to find their avatar_url
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', targetUserId)
          .single();

        if (profile?.avatar_url) {
          // Get the public URL for the avatar
          const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(profile.avatar_url);
          
          setAvatarUrl(data.publicUrl);
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvatar();
  }, [targetUserId]);

  const getInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial || '?';
  };

  if (loading) {
    return (
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarFallback>
          <div className="animate-pulse bg-gray-300 rounded-full w-full h-full" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={avatarUrl || undefined} alt="Profile picture" />
      <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium">
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );
};
