
import React from 'react';
import { useParams } from 'react-router-dom';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ThumbsUp, Search, Plus, Pin } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const Forums = () => {
  const { courseId } = useParams();

  const forumPosts = [
    {
      id: 1,
      title: "Question about React hooks",
      author: "Sarah Chen",
      replies: 12,
      likes: 8,
      lastActivity: "2 hours ago",
      isPinned: true,
      category: "Q&A"
    },
    {
      id: 2,
      title: "Project showcase: Todo App with Redux",
      author: "Mike Johnson",
      replies: 5,
      likes: 15,
      lastActivity: "4 hours ago",
      isPinned: false,
      category: "Projects"
    },
    {
      id: 3,
      title: "Best practices for component structure",
      author: "Lisa Wang",
      replies: 18,
      likes: 23,
      lastActivity: "1 day ago",
      isPinned: false,
      category: "Discussion"
    }
  ];

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <LocalizedText text="Course Forum" />
          </h1>
          <p className="text-muted-foreground">
            <LocalizedText text="Discuss topics, ask questions, and help your fellow students" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <PlatformCard>
              <div className="flex gap-4 items-center mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search discussions..." className="pl-10" />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  <LocalizedText text="New Post" />
                </Button>
              </div>
            </PlatformCard>

            <div className="space-y-4">
              {forumPosts.map((post) => (
                <PlatformCard key={post.id}>
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {post.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
                            <h3 className="font-semibold hover:text-primary cursor-pointer">
                              {post.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>by {post.author}</span>
                            <span>•</span>
                            <span>{post.lastActivity}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.replies} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </PlatformCard>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Forum Guidelines" />
              </h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Be respectful and constructive</p>
                <p>• Search before posting</p>
                <p>• Use clear, descriptive titles</p>
                <p>• Help others when you can</p>
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Categories" />
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Q&A</span>
                  <span className="text-muted-foreground">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Projects</span>
                  <span className="text-muted-foreground">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discussion</span>
                  <span className="text-muted-foreground">18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Announcements</span>
                  <span className="text-muted-foreground">3</span>
                </div>
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Active Contributors" />
              </h3>
              <div className="space-y-3">
                {['Sarah Chen', 'Mike Johnson', 'Lisa Wang'].map((name, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{name}</span>
                  </div>
                ))}
              </div>
            </PlatformCard>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};
