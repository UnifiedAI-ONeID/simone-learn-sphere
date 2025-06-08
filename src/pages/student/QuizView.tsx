import React from 'react';
import { useParams } from 'react-router-dom';
import { PlatformLayout } from '@/components/platform/PlatformLayout';
import { PlatformCard } from '@/components/platform/PlatformCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

export const QuizView = () => {
  const { id, quizId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const totalQuestions = 5;

  const question = {
    id: 1,
    question: "What is the primary purpose of React components?",
    options: [
      "To handle HTTP requests",
      "To split the UI into independent, reusable pieces",
      "To manage database connections",
      "To style web pages"
    ],
    correctAnswer: 1
  };

  return (
    <PlatformLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            <UnifiedLocalizedText text="React Components Quiz" />
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>25 minutes remaining</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>Question {currentQuestion} of {totalQuestions}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <PlatformCard>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Question {currentQuestion}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((currentQuestion / totalQuestions) * 100)}% complete
                  </span>
                </div>
                <Progress value={(currentQuestion / totalQuestions) * 100} className="mb-6" />
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">
                    {question.question}
                  </h3>
                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border rounded hover:bg-accent">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex gap-3 pt-6 border-t">
                  <Button 
                    variant="outline" 
                    disabled={currentQuestion === 1}
                    onClick={() => setCurrentQuestion(prev => Math.max(1, prev - 1))}
                  >
                    <UnifiedLocalizedText text="Previous" />
                  </Button>
                  <Button 
                    disabled={!selectedAnswer}
                    onClick={() => {
                      if (currentQuestion < totalQuestions) {
                        setCurrentQuestion(prev => prev + 1);
                        setSelectedAnswer('');
                      }
                    }}
                  >
                    <UnifiedLocalizedText text={currentQuestion === totalQuestions ? "Submit Quiz" : "Next Question"} />
                  </Button>
                </div>
              </div>
            </PlatformCard>
          </div>

          <div className="space-y-6">
            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <UnifiedLocalizedText text="Quiz Progress" />
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {[...Array(totalQuestions)].map((_, index) => (
                  <div
                    key={index}
                    className={`aspect-square flex items-center justify-center text-xs rounded border ${
                      index + 1 === currentQuestion
                        ? 'bg-primary text-primary-foreground border-primary'
                        : index + 1 < currentQuestion
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-gray-100 text-gray-500 border-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </PlatformCard>

            <PlatformCard>
              <h3 className="font-semibold mb-3">
                <UnifiedLocalizedText text="Quiz Details" />
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Questions</span>
                  <span>{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Limit</span>
                  <span>30 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Passing Score</span>
                  <span>70%</span>
                </div>
              </div>
            </PlatformCard>
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};
