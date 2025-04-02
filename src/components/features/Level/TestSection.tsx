import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Test, Question } from '@/types';
import { CheckSquare, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface TestSectionProps {
  tests: Test[];
  completedTestIds: string[];
  onTestComplete: (testId: string) => void;
  isMarkingCompleted?: boolean;
}

export const TestSection: React.FC<TestSectionProps> = ({
  tests,
  completedTestIds,
  onTestComplete,
  isMarkingCompleted = false
}) => {
  // State to track which test is currently open
  const [openTestId, setOpenTestId] = useState<string | null>(null);
  
  // State to track answers for the current test
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
  
  // State to track current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Helper function to check if test is completed
  const isTestCompleted = (testId: string) => completedTestIds.includes(testId);
  
  // Get current test
  const currentTest = tests.find(test => test.id === openTestId);
  
  // Get current question
  const currentQuestion = currentTest?.questions[currentQuestionIndex];
  
  // Handle test start
  const handleStartTest = (testId: string) => {
    setOpenTestId(testId);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };
  
  // Handle test close
  const handleCloseTest = () => {
    setOpenTestId(null);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };
  
  // Handle answer selection for single-choice questions
  const handleSingleChoiceAnswer = (questionId: string, value: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // Handle answer selection for multiple-choice questions
  const handleMultipleChoiceAnswer = (questionId: string, value: string, checked: boolean) => {
    setSelectedAnswers(prev => {
      const currentAnswers = prev[questionId] as string[] || [];
      const newAnswers = checked 
        ? [...currentAnswers, value]
        : currentAnswers.filter(answer => answer !== value);
      
      return {
        ...prev,
        [questionId]: newAnswers
      };
    });
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    if (!currentTest || !currentQuestion) return;
    
    if (currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete test if all questions are answered
      onTestComplete(currentTest.id);
      toast.success('Тест успешно пройден!');
      handleCloseTest();
    }
  };
  
  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false;
    
    const answer = selectedAnswers[currentQuestion.id];
    if (!answer) return false;
    
    if (currentQuestion.type === 'multiple-choice') {
      return (answer as string[]).length > 0;
    }
    
    return true;
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Тесты для закрепления</h2>
      {tests.map((test) => {
        const completed = isTestCompleted(test.id);
        return (
          <Card 
            key={test.id} 
            className={cn(
              "transition-all duration-300 hover:shadow-md",
              completed && "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20"
            )}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                {completed && <CheckSquare className="h-4 w-4 text-green-600 mr-2" />}
                {test.title}
              </CardTitle>
              <CardDescription>
                {test.questions.length} вопросов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-md p-4 mb-3 flex flex-col items-center justify-center">
                <FileText className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-muted-foreground text-sm">
                  Проверьте свои знания, ответив на вопросы теста
                </p>
              </div>
              <div className="flex justify-end">
                <Button 
                  variant={completed ? "outline" : "default"} 
                  size="sm" 
                  disabled={completed || isMarkingCompleted}
                  onClick={() => handleStartTest(test.id)}
                >
                  {completed ? "Пройден" : "Начать тест"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {/* Test Dialog */}
      <Dialog open={openTestId !== null} onOpenChange={(open) => !open && handleCloseTest()}>
        <DialogContent className="sm:max-w-md md:max-w-xl">
          <DialogHeader>
            <DialogTitle>{currentTest?.title}</DialogTitle>
            <DialogDescription>
              Вопрос {currentQuestionIndex + 1} из {currentTest?.questions.length}
            </DialogDescription>
          </DialogHeader>
          
          {currentQuestion && (
            <div className="py-4">
              <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
              
              {currentQuestion.type === 'single-choice' && (
                <RadioGroup
                  value={selectedAnswers[currentQuestion.id] as string}
                  onValueChange={(value) => handleSingleChoiceAnswer(currentQuestion.id, value)}
                >
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2 py-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              {currentQuestion.type === 'multiple-choice' && (
                <div className="space-y-2">
                  {currentQuestion.options?.map((option, index) => {
                    const answers = selectedAnswers[currentQuestion.id] as string[] || [];
                    const isChecked = answers.includes(option);
                    
                    return (
                      <div key={index} className="flex items-center space-x-2 mb-2 py-2">
                        <Checkbox 
                          id={`option-${index}`} 
                          checked={isChecked}
                          onCheckedChange={(checked) => 
                            handleMultipleChoiceAnswer(currentQuestion.id, option, checked as boolean)
                          }
                        />
                        <Label htmlFor={`option-${index}`}>{option}</Label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              onClick={handleNextQuestion}
              disabled={!isCurrentQuestionAnswered()}
            >
              {currentQuestionIndex < (currentTest?.questions.length || 0) - 1 
                ? "Следующий вопрос" 
                : "Завершить тест"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 