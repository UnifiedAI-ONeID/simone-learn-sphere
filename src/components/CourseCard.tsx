
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Course } from '@/hooks/useCourses';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: string) => void;
  onEdit?: (course: Course) => void;
  showActions?: boolean;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onEdit,
  showActions = true,
  isEnrolled = false,
}) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={course.thumbnail_url || '/placeholder.svg'}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {course.difficulty_level || 'beginner'}
            </Badge>
          </div>
          {course.pricing?.is_free && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-500 text-white">FREE</Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-2">
          {course.category?.icon && (
            <div className="w-5 h-5 text-blue-600">
              <BookOpen className="w-full h-full" />
            </div>
          )}
          <span className="text-sm text-blue-600 font-medium">
            {course.category?.name || 'Uncategorized'}
          </span>
        </div>

        <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description || 'No description available'}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.estimated_duration || 1}h</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.enrollment_count || 0} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>4.8</span>
          </div>
        </div>

        {course.educator && (
          <p className="text-sm text-gray-600">
            by {course.educator.first_name || ''} {course.educator.last_name || ''}
          </p>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="p-6 pt-0">
          <div className="flex gap-2 w-full">
            {isEnrolled ? (
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Continue Learning
              </Button>
            ) : (
              <Button 
                onClick={() => onEnroll?.(course.id)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {course.pricing?.is_free ? 'Enroll Free' : `Enroll $${course.pricing?.price || 0}`}
              </Button>
            )}
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(course)}>
                Edit
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};
