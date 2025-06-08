
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Plus, Search, ThumbsUp, Reply, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  replies: number;
  category: string;
}

export const Forums = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mockPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Best study techniques for programming?',
      content: 'I\'m struggling with retaining programming concepts. What are your best study methods?',
      author: 'John Doe',
      timestamp: '2 hours ago',
      likes: 15,
      replies: 8,
      category: 'Study Tips'
    },
    {
      id: '2',
      title: 'JavaScript vs Python for beginners',
      content: 'Which language should I start with as a complete beginner?',
      author: 'Jane Smith',
      timestamp: '5 hours ago',
      likes: 23,
      replies: 12,
      category: 'Programming'
    },
    {
      id: '3',
      title: 'How to stay motivated during long courses?',
      content: 'I keep losing motivation halfway through courses. Any tips?',
      author: 'Mike Johnson',
      timestamp: '1 day ago',
      likes: 31,
      replies: 18,
      category: 'Motivation'
    }
  ];

  const categories = ['all', 'Study Tips', 'Programming', 'Motivation', 'Career', 'Technical Help'];

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Forums</h1>
          <p className="text-gray-600">Connect with fellow learners and share knowledge</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{post.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {post.timestamp}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  
                  <p className="text-gray-700">{post.content}</p>
                  
                  <div className="flex items-center space-x-4 pt-2">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {post.replies} replies
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-600">Try adjusting your search or create a new post to start the discussion.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
