import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { Button } from './Button';
import { generateChallengeQuestion } from '../services/geminiService';

interface QuizViewProps {
  initialQuestions: Question[];
  mode: 'GLOBAL_CHALLENGE' | 'MINI_CHALLENGE';
  targetSubject?: string | null;
  onExit: (finalScore: number, questionsAnswered: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ initialQuestions, mode, targetSubject, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Track actual questions answered in this session
  const [questionsAnsweredSession, setQuestionsAnsweredSession] = useState(0);

  const currentQuestion = questions[currentIndex];

  // If we are in mini challenge mode and running low on questions (or starting empty), generate more
  useEffect(() => {
    // If we have questions, but we are at the end, generate more.
    // OR if we started with 0 questions (specific subject), generate immediately.
    const needsQuestions = currentIndex >= questions.length - 1 || questions.length === 0;

    if (mode === 'MINI_CHALLENGE' && needsQuestions && !isLoading) {
      setIsLoading(true);
      
      let subjectToGenerate = '';
      if (targetSubject) {
        subjectToGenerate = targetSubject;
      } else {
        // Generate a random subject
        const subjects = ['Matemática', 'História do Brasil', 'Geografia', 'Biologia', 'Física', 'Química', 'Linguagens'];
        subjectToGenerate = subjects[Math.floor(Math.random() * subjects.length)];
      }
      
      generateChallengeQuestion(subjectToGenerate).then(newQ => {
        setQuestions(prev => [...prev, newQ]);
        setIsLoading(false);
      });
    }
  }, [currentIndex, mode, questions.length, isLoading, targetSubject]);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    setQuestionsAnsweredSession(prev => prev + 1); // Increment answered count
    if (index === currentQuestion.correctIndex) {
      setScore(prev => prev + 100); // 100 XP per correct answer
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else if (mode === 'GLOBAL_CHALLENGE') {
      // End of global challenge
      onExit(score, questionsAnsweredSession);
    }
  };

  const handleExitClick = () => {
      onExit(score, questionsAnsweredSession);
  }

  if (!currentQuestion) {
      return (
        <div className="h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Preparando Desafio</h3>
            <p className="text-gray-500">{targetSubject ? `Gerando questão de ${targetSubject}...` : 'Carregando próxima questão...'}</p>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-gray-100">
        <button onClick={handleExitClick} className="text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider truncate max-w-[150px]">
            {targetSubject ? targetSubject : (mode === 'GLOBAL_CHALLENGE' ? 'Simulado Global' : 'Mini Desafio')}
          </span>
          <div className="flex items-center gap-1 text-primary-600 font-bold">
            <span>{currentIndex + 1}</span>
            <span className="text-gray-300">/</span>
            <span>{mode === 'GLOBAL_CHALLENGE' ? questions.length : '∞'}</span>
          </div>
        </div>
        <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-bold">
          {score} XP
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-1">
        <div 
          className="bg-primary-500 h-1 transition-all duration-300" 
          style={{ width: `${((currentIndex + 1) / (mode === 'GLOBAL_CHALLENGE' ? questions.length : questions.length + 1)) * 100}%` }}
        ></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <div className="mb-4">
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded mb-2 font-medium">
                {currentQuestion.subject} • {currentQuestion.year}
            </span>
            <p className="text-lg text-gray-800 font-medium leading-relaxed">
            {currentQuestion.text}
            </p>
        </div>

        <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
                let stateClass = "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"; // default
                
                if (isAnswered) {
                    if (idx === currentQuestion.correctIndex) {
                        stateClass = "border-green-500 bg-green-50 text-green-700 font-medium";
                    } else if (idx === selectedOption) {
                        stateClass = "border-red-500 bg-red-50 text-red-700";
                    } else {
                        stateClass = "border-gray-100 text-gray-400 opacity-60";
                    }
                } else if (selectedOption === idx) {
                    stateClass = "border-primary-500 bg-primary-50 text-primary-700";
                }

                return (
                    <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${stateClass}`}
                    >
                        <div className="flex gap-3">
                            <span className={`
                                flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold
                                ${isAnswered && idx === currentQuestion.correctIndex ? 'bg-green-500 border-green-500 text-white' : ''}
                                ${isAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex ? 'bg-red-500 border-red-500 text-white' : ''}
                                ${!isAnswered ? 'border-gray-300 text-gray-400' : ''}
                            `}>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{option}</span>
                        </div>
                    </button>
                );
            })}
        </div>

        {/* Explanation Block */}
        {isAnswered && (
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
                <h4 className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Resolução
                </h4>
                <p className="text-blue-700 text-sm leading-relaxed">{currentQuestion.explanation}</p>
            </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-white p-4 border-t border-gray-100 shadow-lg">
        <Button 
            fullWidth 
            onClick={handleNext} 
            disabled={!isAnswered}
            variant={isAnswered ? 'primary' : 'secondary'}
            className={!isAnswered ? 'opacity-50' : ''}
        >
            {currentIndex === questions.length - 1 && mode === 'GLOBAL_CHALLENGE' ? 'Finalizar Desafio' : 'Próxima Questão'}
        </Button>
      </div>
    </div>
  );
};