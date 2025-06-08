import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Clock, User, Activity, Search, Filter } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const AIAuditTrail = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          <UnifiedLocalizedText text="AI Audit Trail" />
        </h1>
        <p className="text-muted-foreground">
          <UnifiedLocalizedText text="Monitor AI usage and track generated content" />
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <div className="flex gap-4 items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content_generation">Content Generation</SelectItem>
                  <SelectItem value="course_planning">Course Planning</SelectItem>
                  <SelectItem value="quiz_generation">Quiz Generation</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Filter className="h-4 w-4 mr-2" />
                <UnifiedLocalizedText text="Filters" />
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            {[1, 2, 3].map((log) => (
              <Card key={log}>
                <div className="flex gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">
                          AI Generated Content
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span><User className="h-4 w-4 mr-1" />Admin User</span>
                          <span>•</span>
                          <span><Clock className="h-4 w-4 mr-1" />2 hours ago</span>
                        </div>
                      </div>
                      <Badge variant="secondary">Content Generation</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Generated a lesson plan for React Hooks.
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold mb-3">
              <UnifiedLocalizedText text="Log Filters" />
            </h3>
            <div className="space-y-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin User</SelectItem>
                  <SelectItem value="educator">Educator</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content_generation">Content Generation</SelectItem>
                  <SelectItem value="course_planning">Course Planning</SelectItem>
                  <SelectItem value="quiz_generation">Quiz Generation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold mb-3">
              <UnifiedLocalizedText text="Recent Activity" />
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((activity) => (
                <div key={activity} className="flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1">
                    <Activity className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm">
                    Admin User generated a quiz.
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
