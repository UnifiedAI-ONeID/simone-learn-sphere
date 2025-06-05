
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UseProfilePictureReturn {
  uploading: boolean;
  uploadAvatar: (file: File) => Promise<boolean>;
  removeAvatar: () => Promise<boolean>;
}

export const useProfilePicture = (): UseProfilePictureReturn => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user, refreshProfile } = useAuth();

  const uploadAvatar = async (file: File): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload a profile picture.",
        variant: "destructive",
      });
      return false;
    }

    setUploading(true);

    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
      }

      // Validate file size (5MB)
      if (file.size > 5242880) {
        throw new Error('File size too large. Please upload an image smaller than 5MB.');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Remove existing avatar if it exists
      await removeExistingAvatar();

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: fileName })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      await refreshProfile();

      toast({
        title: "Success",
        description: "Profile picture updated successfully!",
      });

      return true;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture.",
        variant: "destructive",
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to remove your profile picture.",
        variant: "destructive",
      });
      return false;
    }

    setUploading(true);

    try {
      await removeExistingAvatar();

      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      await refreshProfile();

      toast({
        title: "Success",
        description: "Profile picture removed successfully!",
      });

      return true;
    } catch (error: any) {
      console.error('Error removing avatar:', error);
      toast({
        title: "Removal failed",
        description: error.message || "Failed to remove profile picture.",
        variant: "destructive",
      });
      return false;
    } finally {
      setUploading(false);
    }
  };

  const removeExistingAvatar = async () => {
    if (!user) return;

    try {
      // Get current avatar URL
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (profile?.avatar_url) {
        // Remove the existing file
        await supabase.storage
          .from('avatars')
          .remove([profile.avatar_url]);
      }
    } catch (error) {
      console.error('Error removing existing avatar:', error);
      // Don't throw here as this is cleanup
    }
  };

  return {
    uploading,
    uploadAvatar,
    removeAvatar,
  };
};
