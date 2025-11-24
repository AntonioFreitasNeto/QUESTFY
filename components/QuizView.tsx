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
  
  const [questionsAnsweredSession, setQuestionsAnsweredSession] = useState(0);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const needsQuestions = currentIndex >= questions.length - 1 || questions.length === 0;

    if (mode === 'MINI_CHALLENGE' && needsQuestions && !isLoading) {
      setIsLoading(true);
      
      let subjectToGenerate = '';
      if (targetSubject) {
        subjectToGenerate = targetSubject;
      } else {
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
    setQuestionsAnsweredSession(prev => prev + 1);
    if (index === currentQuestion.correctIndex) {
      setScore(prev => prev + 100); 
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else if (mode === 'GLOBAL_CHALLENGE') {
      onExit(score, questionsAnsweredSession);
    }
  };

  const handleExitClick = () => {
      onExit(score, questionsAnsweredSession);
  }

  if (!currentQuestion) {
      return (
        <div className="h-screen flex flex-col items-center justify-center p-8 text-center bg-game-bg text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mb-6"></div>
            <h3 className="text-xl font-black uppercase tracking-widest text-cyan-500 mb-2">Loading Level</h3>
            <p className="text-slate-500 font-mono text-xs">{targetSubject ? `Generating: ${targetSubject}` : 'Spawning enemies...'}</p>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-screen bg-game-bg text-white">
      {/* HUD Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-slate-900 border-b border-slate-800">
        <button onClick={handleExitClick} className="text-slate-500 hover:text-red-400 font-bold text-xs uppercase border border-slate-700 px-2 py-1 rounded hover:border-red-500 transition-colors">
          Quit
        </button>
        
        <div className="flex flex-col items-center">
             <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
                 {mode === 'GLOBAL_CHALLENGE' ? 'RANKED' : 'ARCADE'}
             </div>
             <div className="w-32 h-2 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / (mode === 'GLOBAL_CHALLENGE' ? questions.length : questions.length + 1)) * 100}%` }}
                ></div>
             </div>
        </div>

        <div className="text-gold font-black text-sm drop-shadow-md">
          {score} XP
        </div>
      </div>

      {/* Battle Area */}
      <div className="flex-1 overflow-y-auto p-5 pb-32">
        <div className="mb-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
                 <span className="px-2 py-1 bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-mono rounded uppercase">
                    {currentQuestion.subject}
                </span>
                <span className="px-2 py-1 bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-mono rounded uppercase">
                    {currentQuestion.year}
                </span>
            </div>
            <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                <p className="text-lg text-slate-200 font-medium leading-relaxed font-sans">
                    {currentQuestion.text}
                </p>
            </div>
        </div>

        <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
                let stateClass = "border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:border-slate-500 hover:text-white"; // default
                let indicatorClass = "bg-slate-900 border-slate-600 text-slate-500";

                if (isAnswered) {
                    if (idx === currentQuestion.correctIndex) {
                        stateClass = "border-emerald-500 bg-emerald-900/30 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                        indicatorClass = "bg-emerald-500 border-emerald-500 text-white";
                    } else if (idx === selectedOption) {
                        stateClass = "border-red-500 bg-red-900/30 text-red-100";
                        indicatorClass = "bg-red-500 border-red-500 text-white";
                    } else {
                        stateClass = "border-slate-800 bg-slate-900/50 text-slate-600 opacity-50";
                    }
                } else if (selectedOption === idx) {
                    stateClass = "border-cyan-500 bg-cyan-900/30 text-cyan-100";
                    indicatorClass = "bg-cyan-500 border-cyan-500 text-white";
                }

                return (
                    <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-100 active:scale-[0.99] ${stateClass}`}
                    >
                        <div className="flex gap-4">
                            <span className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold border ${indicatorClass}`}>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-sm font-medium">{option}</span>
                        </div>
                    </button>
                );
            })}
        </div>

        {/* Loot/Intel Block */}
        {isAnswered && (
            <div className="mt-6 p-4 bg-indigo-900/20 rounded-xl border border-indigo-500/50 animate-fade-in-up">
                <h4 className="font-bold text-indigo-400 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Intel Acquired
                </h4>
                <p className="text-indigo-200 text-sm leading-relaxed">{currentQuestion.explanation}</p>
            </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-slate-900 p-4 border-t border-slate-800 shadow-2xl z-50">
        <Button 
            fullWidth 
            onClick={handleNext} 
            disabled={!isAnswered}
            variant={isAnswered ? 'primary' : 'secondary'}
        >
            {currentIndex === questions.length - 1 && mode === 'GLOBAL_CHALLENGE' ? 'Complete Mission' : 'Next Level'}
        </Button>
      </div>
    </div>
  );
};