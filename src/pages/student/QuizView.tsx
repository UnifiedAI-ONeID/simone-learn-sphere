
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Clock, Award, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { UnifiedLocalizedText } from '@/components/UnifiedLocalizedText';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    text: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
    explanation: 'Paris is the capital and largest city of France.'
  },
  {
    id: 2,
    text: 'Which planet is known as the "Red Planet"?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Mars',
    explanation: 'Mars is often called the "Red Planet" due to its reddish appearance.'
  },
  {
    id: 3,
    text: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctAnswer: 'Blue Whale',
    explanation: 'The Blue Whale is the largest known mammal on Earth.'
  }
];

export const QuizView = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(mockQuestions.length).fill(''));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const totalQuestions = mockQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerChange = (answer: string) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = answer;
    setUserAnswers(updatedAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
      setQuizCompleted(true);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswersCount = 0;
    for (let i = 0; i < totalQuestions; i++) {
      if (userAnswers[i] === mockQuestions[i].correctAnswer) {
        correctAnswersCount++;
      }
    }
    const calculatedScore = (correctAnswersCount / totalQuestions) * 100;
    setScore(calculatedScore);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(Array(mockQuestions.length).fill(''));
    setQuizCompleted(false);
    setScore(0);
  };

  const isCorrect = quizCompleted && userAnswers[currentQuestionIndex] === currentQuestion.correctAnswer;

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            <UnifiedLocalizedText text="Quiz Time!" />
          </CardTitle>
          <CardDescription>
            <UnifiedLocalizedText text="Test your knowledge and earn rewards" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="text-sm text-muted-foreground">
            <UnifiedLocalizedText text="Question" /> {currentQuestionIndex + 1} / {totalQuestions}
          </div>

          {!quizCompleted ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  <UnifiedLocalizedText text={currentQuestion.text} />
                </h3>
                <RadioGroup defaultValue={userAnswers[currentQuestionIndex]} onValueChange={handleAnswerChange}>
                  {currentQuestion.options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${option}`} className="border-2" />
                      <Label htmlFor={`option-${option}`}>
                        <UnifiedLocalizedText text={option} />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <UnifiedLocalizedText text="Previous" />
                </Button>
                <Button size="sm" onClick={goToNextQuestion}>
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <><UnifiedLocalizedText text="Submit Quiz" /></>
                  ) : (
                    <>
                      <UnifiedLocalizedText text="Next" />
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  <UnifiedLocalizedText text="Quiz Completed!" />
                </h3>
                <Badge variant="secondary">
                  <Award className="h-4 w-4 mr-2" />
                  <UnifiedLocalizedText text={`Score: ${score.toFixed(0)}%`} />
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-medium">
                  <UnifiedLocalizedText text="Question" /> {currentQuestionIndex + 1}: <UnifiedLocalizedText text={currentQuestion.text} />
                </h4>
                {isCorrect ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <UnifiedLocalizedText text="Correct!" /> {currentQuestion.explanation}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <UnifiedLocalizedText text="Incorrect." /> <UnifiedLocalizedText text="The correct answer is" /> {currentQuestion.correctAnswer}. {currentQuestion.explanation}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button onClick={resetQuiz}>
                <RefreshCw className="h-4 w-4 mr-2" />
                <UnifiedLocalizedText text="Retake Quiz" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
