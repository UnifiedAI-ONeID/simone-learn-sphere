
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Brain, 
  ArrowLeft, 
  ArrowRight,
  Trophy,
  Target
} from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple-choice' | 'multiple-select' | 'true-false';
  question: string;
  options: string[];
  correctAnswers: string[];
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in minutes
  questions: Question[];
  passingScore: number;
}

export const QuizView = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Mock quiz data
  const quiz: Quiz = {
    id: quizId || '1',
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
    timeLimit: 30,
    passingScore: 70,
    questions: [
      {
        id: '1',
        type: 'multiple-choice',
        question: 'Which of the following is the correct way to declare a variable in JavaScript?',
        options: ['var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
        correctAnswers: ['var myVar = 5;'],
        explanation: 'In JavaScript, variables can be declared using var, let, or const keywords.'
      },
      {
        id: '2',
        type: 'multiple-select',
        question: 'Which of the following are JavaScript data types? (Select all that apply)',
        options: ['String', 'Number', 'Boolean', 'Integer', 'Character'],
        correctAnswers: ['String', 'Number', 'Boolean'],
        explanation: 'JavaScript has several primitive data types including String, Number, Boolean, undefined, null, and Symbol.'
      },
      {
        id: '3',
        type: 'true-false',
        question: 'JavaScript is a case-sensitive language.',
        options: ['True', 'False'],
        correctAnswers: ['True'],
        explanation: 'JavaScript is indeed case-sensitive, meaning "myVariable" and "MyVariable" are different identifiers.'
      }
    ]
  };

  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      setTimeRemaining(quiz.timeLimit * 60); // Convert to seconds
    }
  }, [quizStarted, quiz.timeLimit, quizCompleted]);

  useEffect(() => {
    if (timeRemaining > 0 && quizStarted && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && quizStarted) {
      handleSubmitQuiz();
    }
  }, [timeRemaining, quizStarted, quizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string, isMultiSelect = false) => {
    setAnswers(prev => {
      if (isMultiSelect) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(answer)
          ? currentAnswers.filter(a => a !== answer)
          : [...currentAnswers, answer];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: [answer] };
      }
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      const userAnswers = answers[question.id] || [];
      const isCorrect = question.correctAnswers.length === userAnswers.length &&
                       question.correctAnswers.every(answer => userAnswers.includes(answer));
      if (isCorrect) correctAnswers++;
    });
    
    const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(finalScore);
    setQuizCompleted(true);
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (!quizStarted) {
    return (
      <div className="container mx-auto py-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <CardDescription className="text-base">{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <Clock className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <p className="font-semibold">Time Limit</p>
                <p className="text-sm text-gray-600">{quiz.timeLimit} minutes</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Target className="h-6 w-6 mx-auto text-green-600 mb-2" />
                <p className="font-semibold">Questions</p>
                <p className="text-sm text-gray-600">{quiz.questions.length} total</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <Trophy className="h-6 w-6 mx-auto text-purple-600 mb-2" />
                <p className="font-semibold">Passing Score</p>
                <p className="text-sm text-gray-600">{quiz.passingScore}%</p>
              </div>
            </div>
            
            <div className="text-center">
              <Button onClick={handleStartQuiz} size="lg" className="px-8">
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizCompleted) {
    const passed = score >= quiz.passingScore;
    
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <Trophy className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {passed ? 'Congratulations!' : 'Quiz Complete'}
            </CardTitle>
            <CardDescription>
              {passed ? 'You passed the quiz!' : 'Better luck next time!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {score}%
              </div>
              <p className="text-gray-600">
                Your Score ({quiz.questions.filter(q => {
                  const userAnswers = answers[q.id] || [];
                  return q.correctAnswers.length === userAnswers.length &&
                         q.correctAnswers.every(answer => userAnswers.includes(answer));
                }).length} out of {quiz.questions.length} correct)
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back to Course
              </Button>
              <Button onClick={() => window.location.reload()}>
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Quiz
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{quiz.title}</h1>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatTime(timeRemaining)}</span>
          </Badge>
        </div>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'true-false' ? (
            <RadioGroup
              value={answers[currentQuestion.id]?.[0] || ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${index}`}
                    checked={answers[currentQuestion.id]?.includes(option) || false}
                    onCheckedChange={() => handleAnswerChange(currentQuestion.id, option, true)}
                  />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button onClick={handleSubmitQuiz}>
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
