
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, Camera } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { useProfilePicture } from '@/hooks/useProfilePicture';
import { useAuth } from '@/contexts/AuthContext';

interface ProfilePictureUploadProps {
  firstName?: string;
  lastName?: string;
}

export const ProfilePictureUpload = ({ firstName, lastName }: ProfilePictureUploadProps) => {
  const { user } = useAuth();
  const { uploading, uploadAvatar, removeAvatar } = useProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file: File) => {
    await uploadAvatar(file);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAvatar = async () => {
    await removeAvatar();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Profile Picture</Label>
          
          <div className="flex flex-col items-center space-y-4">
            {/* Current Avatar Display */}
            <UserAvatar
              userId={user?.id}
              firstName={firstName}
              lastName={lastName}
              size="lg"
              className="border-4 border-gray-200"
            />

            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 w-full max-w-sm text-center transition-colors cursor-pointer ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileInput}
                className="hidden"
                disabled={uploading}
              />
              
              <div className="space-y-2">
                <Camera className="mx-auto h-8 w-8 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:underline">
                    Click to upload
                  </span>
                  {' '}or drag and drop
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP or GIF (max. 5MB)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                disabled={uploading}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>{uploading ? 'Uploading...' : 'Upload New'}</span>
              </Button>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveAvatar}
                disabled={uploading}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
