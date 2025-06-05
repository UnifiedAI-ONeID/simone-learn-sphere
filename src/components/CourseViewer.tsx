
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, CheckCircle, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLessons } from '@/hooks/useLessons';
import { useEnrollments } from '@/hooks/useEnrollments';

interface CourseViewerProps {
  courseId: string;
  onBack: () => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({ courseId, onBack }) => {
  const { lessons, loading, completeLesson } = useLessons(courseId);
  const { enrollments, updateProgress } = useEnrollments();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const enrollment = enrollments.find(e => e.course_id === courseId);
  const currentLesson = lessons[currentLessonIndex];

  const handleLessonComplete = async () => {
    if (!currentLesson) return;

    await completeLesson(currentLesson.id, 30); // 30 minutes placeholder
    
    // Update overall course progress
    const newProgress = Math.round(((currentLessonIndex + 1) / lessons.length) * 100);
    if (enrollment) {
      await updateProgress(enrollment.id, newProgress);
    }

    // Move to next lesson
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const goToLesson = (index: number) => {
    setCurrentLessonIndex(index);
  };

  if (loading) {
    return <div className="animate-pulse">Loading course content...</div>;
  }

  if (!currentLesson) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No lessons available for this course.</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Course Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Lesson {currentLessonIndex + 1} of {lessons.length}
          </span>
          <Progress value={(currentLessonIndex / lessons.length) * 100} className="w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lesson Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  {currentLesson.lesson_type === 'video' ? (
                    <PlayCircle className="w-6 h-6 text-blue-600" />
                  ) : (
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">
                        {currentLessonIndex + 1}
                      </span>
                    </div>
                  )}
                  {currentLesson.title}
                </CardTitle>
                <Badge>{currentLesson.lesson_type}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {currentLesson.estimated_duration} min
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Content */}
              {currentLesson.lesson_type === 'video' && currentLesson.video_url && (
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <iframe
                    src={currentLesson.video_url}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Text Content */}
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {currentLesson.content}
                </div>
              </div>

              {/* Lesson Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  disabled={currentLessonIndex === 0}
                  onClick={() => setCurrentLessonIndex(currentLessonIndex - 1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentLessonIndex < lessons.length - 1 ? (
                  <Button onClick={handleLessonComplete}>
                    Complete & Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleLessonComplete} className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Course
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{enrollment?.progress_percentage || 0}%</span>
                  </div>
                  <Progress value={enrollment?.progress_percentage || 0} />
                </div>
                <div className="text-sm text-gray-600">
                  {lessons.filter((_, index) => index <= currentLessonIndex).length} of {lessons.length} lessons completed
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {lessons.map((lesson, index) => (
                <button
                  key={lesson.id}
                  onClick={() => goToLesson(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentLessonIndex
                      ? 'bg-blue-100 border-2 border-blue-200'
                      : index < currentLessonIndex
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {index < currentLessonIndex ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : index === currentLessonIndex ? (
                        <PlayCircle className="w-4 h-4 text-blue-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className="text-sm font-medium">{lesson.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">{lesson.estimated_duration}m</span>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
