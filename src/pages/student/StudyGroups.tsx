
import React from 'react';
import { useParams } from 'react-router-dom';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Video, MessageSquare, Calendar, Clock } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const StudyGroups = () => {
  const { groupId } = useParams();

  const groupMembers = [
    { name: "Alex Chen", role: "Leader", online: true },
    { name: "Sarah Johnson", role: "Member", online: true },
    { name: "Mike Rodriguez", role: "Member", online: false },
    { name: "Emma Wilson", role: "Member", online: true },
  ];

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">React Study Group</h1>
          <p className="text-muted-foreground">
            <LocalizedText text="Collaborative learning session in progress" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <PlatformCard>
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Live Study Session</p>
                  <p className="text-sm opacity-75">Video conferencing area</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button>
                  <Video className="h-4 w-4 mr-2" />
                  <LocalizedText text="Join Video" />
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <LocalizedText text="Chat" />
                </Button>
                <Button variant="outline">
                  <LocalizedText text="Share Screen" />
                </Button>
              </div>
            </PlatformCard>

            <PlatformCard className="mt-6">
              <h2 className="text-xl font-semibold mb-4">
                <LocalizedText text="Study Plan" />
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">React Hooks Review (30 min)</p>
                    <p className="text-sm text-muted-foreground">useState, useEffect, custom hooks</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Practice Exercise (45 min)</p>
                    <p className="text-sm text-muted-foreground">Build a counter component together</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Q&A Session (15 min)</p>
                    <p className="text-sm text-muted-foreground">Address any questions or doubts</p>
                  </div>
                </div>
              </div>
            </PlatformCard>
          </div>

          <div className="space-y-6">
            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Group Members" />
              </h3>
              <div className="space-y-3">
                {groupMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {member.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {member.role}
                        </Badge>
                        <span className={`text-xs ${member.online ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {member.online ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Session Info" />
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Started 30 minutes ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>1 hour remaining</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>4/6 members present</span>
                </div>
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Shared Resources" />
              </h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <LocalizedText text="React Documentation" />
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <LocalizedText text="Practice Exercises" />
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <LocalizedText text="Code Sandbox" />
                </Button>
              </div>
            </PlatformCard>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};
