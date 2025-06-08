
import React from 'react';
import { useParams } from 'react-router-dom';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import { LocalizedText } from '@/components/LocalizedText';

export const Assignments = () => {
  const { id } = useParams();

  const assignments = [
    { id: 1, title: "React Components Quiz", type: "quiz", dueDate: "2024-06-15", status: "pending", urgent: true },
    { id: 2, title: "Build a Todo App", type: "project", dueDate: "2024-06-20", status: "in_progress", urgent: false },
    { id: 3, title: "State Management Exercise", type: "exercise", dueDate: "2024-06-25", status: "completed", urgent: false },
  ];

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <LocalizedText text="Assignments & Deadlines" />
          </h1>
          <p className="text-muted-foreground">
            <LocalizedText text="Track your upcoming assignments and deadlines" />
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {assignments.map((assignment) => (
              <PlatformCard key={assignment.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{assignment.title}</h3>
                      {assignment.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      )}
                      <Badge variant={
                        assignment.status === 'completed' ? 'default' :
                        assignment.status === 'in_progress' ? 'secondary' : 'outline'
                      }>
                        {assignment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span className="capitalize">{assignment.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due {assignment.dueDate}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete this assignment to demonstrate your understanding of the concepts covered in this module.
                    </p>
                  </div>
                  <div className="ml-4">
                    {assignment.status === 'completed' ? (
                      <Button variant="outline" size="sm">
                        <LocalizedText text="Review" />
                      </Button>
                    ) : (
                      <Button size="sm">
                        <LocalizedText text={assignment.status === 'in_progress' ? "Continue" : "Start"} />
                      </Button>
                    )}
                  </div>
                </div>
              </PlatformCard>
            ))}
          </div>

          <div className="space-y-6">
            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Upcoming Deadlines" />
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded border border-red-200">
                  <Clock className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Due Tomorrow</p>
                    <p className="text-xs text-red-700">React Components Quiz</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded border border-yellow-200">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Due in 5 days</p>
                    <p className="text-xs text-yellow-700">Todo App Project</p>
                  </div>
                </div>
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <LocalizedText text="Assignment Stats" />
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Completed</span>
                  <span className="text-sm font-medium">1/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">In Progress</span>
                  <span className="text-sm font-medium">1/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Pending</span>
                  <span className="text-sm font-medium">1/3</span>
                </div>
              </div>
            </PlatformCard>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};
