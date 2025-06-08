
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';

export const ProfilePictureUpload = () => {
  const [avatar, setAvatar] = useState<string>('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Profile Picture
        </CardTitle>
        <CardDescription>
          Upload your profile picture
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatar} />
          <AvatarFallback>
            <Camera className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Picture
        </Button>
      </CardContent>
    </Card>
  );
};
