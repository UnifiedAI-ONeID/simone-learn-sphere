
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Filter, Star, Clock, Users } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const StudentCourses = () => {
  const navigate = useNavigate();

  const enrolledCourses = [
    { 
      id: 1, 
      title: 'React Fundamentals', 
      instructor: 'Sarah Johnson',
      progress: 75, 
      totalLessons: 24, 
      completedLessons: 18,
      rating: 4.8,
      thumbnail: '/placeholder.svg',
      difficulty: 'Beginner'
    },
    { 
      id: 2, 
      title: 'JavaScript ES6+', 
      instructor: 'Mike Chen',
      progress: 45, 
      totalLessons: 18, 
      completedLessons: 8,
      rating: 4.6,
      thumbnail: '/placeholder.svg',
      difficulty: 'Intermediate'
    }
  ];

  const availableCourses = [
    {
      id: 3,
      title: 'Node.js Backend Development',
      instructor: 'Alex Rivera',
      price: 99,
      rating: 4.9,
      students: 1234,
      duration: '8 hours',
      thumbnail: '/placeholder.svg',
      difficulty: 'Advanced'
    },
    {
      id: 4,
      title: 'Python for Data Science',
      instructor: 'Emma Watson',
      price: 79,
      rating: 4.7,
      students: 2156,
      duration: '12 hours',
      thumbnail: '/placeholder.svg',
      difficulty: 'Beginner'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            <LocalizedText text="My Courses" />
          </h1>
          <p className="text-muted-foreground mt-2">
            <LocalizedText text="Continue your learning journey" />
          </p>
        </div>
        <Button onClick={() => navigate('/student/dashboard')}>
          <LocalizedText text="Back to Dashboard" />
        </Button>
      </div>

      {/* Enrolled Courses */}
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          <LocalizedText text="Currently Enrolled" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="bg-card text-card-foreground hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/student/course/${course.id}`)}>
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg"></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>by {course.instructor}</CardDescription>
                  </div>
                  <Badge variant="secondary">{course.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                </div>
                
                <Button className="w-full">
                  <LocalizedText text="Continue Learning" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Browse More Courses */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-foreground">
            <LocalizedText text="Discover New Courses" />
          </h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search courses..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableCourses.map((course) => (
            <Card key={course.id} className="bg-card text-card-foreground hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg"></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>by {course.instructor}</CardDescription>
                  </div>
                  <Badge variant="secondary">{course.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {course.students.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.duration}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-foreground">${course.price}</span>
                  <Button onClick={() => navigate(`/student/course/${course.id}/preview`)}>
                    <LocalizedText text="Preview" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
