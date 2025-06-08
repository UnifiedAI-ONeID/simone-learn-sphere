
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Plus, 
  MessageCircle, 
  Calendar,
  Clock,
  BookOpen,
  Video,
  MapPin,
  Star,
  Filter
} from 'lucide-react';

export const StudyGroups = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Mock data
  const myGroups = [
    {
      id: 1,
      name: 'React Study Circle',
      subject: 'Web Development',
      members: 12,
      maxMembers: 15,
      nextSession: '2024-06-10 14:00',
      description: 'Weekly sessions focused on React concepts and project building',
      isOnline: true,
      avatar: '/api/placeholder/150/150',
      activity: 'High',
      joined: true
    },
    {
      id: 2,
      name: 'JavaScript Fundamentals',
      subject: 'Programming',
      members: 8,
      maxMembers: 10,
      nextSession: '2024-06-12 16:00',
      description: 'Learning JavaScript from basics to advanced topics',
      isOnline: false,
      location: 'Library Room 201',
      avatar: '/api/placeholder/150/150',
      activity: 'Medium',
      joined: true
    }
  ];

  const availableGroups = [
    {
      id: 3,
      name: 'Python Data Science',
      subject: 'Data Science',
      members: 15,
      maxMembers: 20,
      nextSession: '2024-06-11 18:00',
      description: 'Exploring data science with Python, pandas, and visualization',
      isOnline: true,
      avatar: '/api/placeholder/150/150',
      activity: 'High',
      rating: 4.8,
      joined: false
    },
    {
      id: 4,
      name: 'UI/UX Design Workshop',
      subject: 'Design',
      members: 6,
      maxMembers: 12,
      nextSession: '2024-06-13 10:00',
      description: 'Hands-on design practice and portfolio review sessions',
      isOnline: false,
      location: 'Design Studio A',
      avatar: '/api/placeholder/150/150',
      activity: 'Medium',
      rating: 4.6,
      joined: false
    }
  ];

  const subjects = ['all', 'Web Development', 'Programming', 'Data Science', 'Design', 'Mathematics'];

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'High':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Study Groups</h1>
          <p className="text-gray-600">Connect with peers and learn together</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <Tabs defaultValue="my-groups" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-groups">My Groups</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{myGroups.length}</div>
                <div className="text-sm text-gray-600">Active Groups</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-gray-600">This Week Sessions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold">47</div>
                <div className="text-sm text-gray-600">Messages Today</div>
              </CardContent>
            </Card>
          </div>

          {/* My Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{group.name}</h3>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{group.subject}</Badge>
                        <Badge className={getActivityColor(group.activity)}>
                          {group.activity} Activity
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {group.members}/{group.maxMembers}
                        </div>
                        <div className="flex items-center gap-1">
                          {group.isOnline ? (
                            <>
                              <Video className="h-3 w-3" />
                              Online
                            </>
                          ) : (
                            <>
                              <MapPin className="h-3 w-3" />
                              {group.location}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Next Session:</span>
                          <span>{formatDate(group.nextSession)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discover" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search study groups..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={selectedSubject === subject ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSubject(subject)}
                      className="capitalize"
                    >
                      {subject}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{group.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {group.rating}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{group.subject}</Badge>
                        <Badge className={getActivityColor(group.activity)}>
                          {group.activity} Activity
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {group.members}/{group.maxMembers}
                        </div>
                        <div className="flex items-center gap-1">
                          {group.isOnline ? (
                            <>
                              <Video className="h-3 w-3" />
                              Online
                            </>
                          ) : (
                            <>
                              <MapPin className="h-3 w-3" />
                              {group.location}
                            </>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Next Session:</span>
                          <span>{formatDate(group.nextSession)}</span>
                        </div>
                      </div>

                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Join Group
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
