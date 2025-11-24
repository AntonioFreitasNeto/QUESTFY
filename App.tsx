import React, { useState } from 'react';
import { AppView, Question, User } from './types';
import { STATIC_QUESTIONS, MOCK_USERS } from './constants';
import { Home } from './components/Home';
import { Leaderboard } from './components/Leaderboard';
import { QuizView } from './components/QuizView';
import { LoginView } from './components/LoginView';
import { PremiumModal } from './components/PremiumModal';
import { ReportView } from './components/ReportView';
import { StudyPlanView } from './components/StudyPlanView';
import { EssayCorrectionView } from './components/EssayCorrectionView';
import { EssayCreditModal } from './components/EssayCreditModal';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LOGIN);
  const [quizMode, setQuizMode] = useState<'GLOBAL_CHALLENGE' | 'MINI_CHALLENGE'>('GLOBAL_CHALLENGE');
  const [quizSubject, setQuizSubject] = useState<string | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumReason, setPremiumReason] = useState<'LIMIT_REACHED' | 'REPORT_LOCKED'>('LIMIT_REACHED');
  const [showEssayCreditModal, setShowEssayCreditModal] = useState(false);

  const handleLogin = (name: string, isGoogle: boolean) => {
    const mockUser = MOCK_USERS.find(u => u.id === 'you');
    if (mockUser) {
        const updatedUser = { 
            ...mockUser, 
            name: name,
            avatar: isGoogle 
                ? 'https://lh3.googleusercontent.com/a/ACg8ocL5y9Xy=s96-c'
                : mockUser.avatar
        };
        setCurrentUser(updatedUser);
        setView(AppView.HOME);
    }
  };

  const startQuiz = (mode: 'GLOBAL_CHALLENGE' | 'MINI_CHALLENGE', subject?: string) => {
    if (!currentUser) return;

    if (!currentUser.isPremium && currentUser.questionsAnswered >= 20) {
        setPremiumReason('LIMIT_REACHED');
        setShowPremiumModal(true);
        return;
    }

    setQuizMode(mode);
    setQuizSubject(subject || null);
    
    if (mode === 'GLOBAL_CHALLENGE') {
        setActiveQuestions(STATIC_QUESTIONS);
    } else {
        if (subject) {
            const filtered = STATIC_QUESTIONS.filter(q => q.subject === subject);
            setActiveQuestions(filtered);
        } else {
            setActiveQuestions([]);
        }
    }
    setView(AppView.QUIZ);
  };

  const handleQuizExit = (score: number, questionsAnsweredSession: number) => {
    if (currentUser) {
        const updatedUser = {
            ...currentUser,
            score: currentUser.score + score,
            questionsAnswered: currentUser.questionsAnswered + questionsAnsweredSession
        };
        setCurrentUser(updatedUser);
    }
    
    alert(`MISSION COMPLETE! XP Gained: ${score}`);
    setView(AppView.HOME);
  };

  const handleUpgrade = () => {
    if (currentUser) {
        setCurrentUser({ ...currentUser, isPremium: true });
        setShowPremiumModal(false);
        alert('ELITE PASS UNLOCKED! 👑');
    }
  };

  const handleBuyCredits = (amount: number) => {
      if (currentUser) {
          setCurrentUser({ ...currentUser, essayCredits: currentUser.essayCredits + amount });
          setShowEssayCreditModal(false);
          alert(`ACQUIRED: ${amount} GEMS!`);
      }
  };

  const handleConsumeCredit = () => {
      if (currentUser) {
          setCurrentUser({ ...currentUser, essayCredits: Math.max(0, currentUser.essayCredits - 1) });
      }
  };

  const NavItem = ({ icon, label, targetView }: { icon: React.ReactNode, label: string, targetView: AppView }) => (
    <button 
      onClick={() => setView(targetView)}
      className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all group ${view === targetView ? 'text-cyan-400 -translate-y-2' : 'text-slate-500 hover:text-slate-300'}`}
    >
      {view === targetView && (
          <div className="absolute -top-4 w-12 h-8 bg-cyan-500/20 blur-xl rounded-full"></div>
      )}
      <div className={`p-1 rounded-lg ${view === targetView ? 'bg-slate-800 border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : ''}`}>
        {icon}
      </div>
      <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );

  if (view === AppView.LOGIN) {
      return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-game-bg font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden text-white border-x border-slate-800">
      
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        onUpgrade={handleUpgrade}
        reason={premiumReason}
      />

      <EssayCreditModal 
        isOpen={showEssayCreditModal}
        onClose={() => setShowEssayCreditModal(false)}
        onBuy={handleBuyCredits}
      />

      {view === AppView.HOME && currentUser && (
        <Home 
          user={currentUser}
          onStartGlobal={() => startQuiz('GLOBAL_CHALLENGE')}
          onStartMini={() => startQuiz('MINI_CHALLENGE')}
          onStartSubject={(subject) => startQuiz('MINI_CHALLENGE', subject || undefined)}
          onOpenReport={() => setView(AppView.REPORT)}
          onOpenStudyPlan={() => setView(AppView.STUDY_PLAN)}
          onOpenEssay={() => setView(AppView.ESSAY)}
        />
      )}

      {view === AppView.LEADERBOARD && (
        <Leaderboard />
      )}

      {view === AppView.REPORT && currentUser && (
        <ReportView 
            isPremium={currentUser.isPremium} 
            onUpgradeClick={() => {
                setPremiumReason('REPORT_LOCKED');
                setShowPremiumModal(true);
            }}
        />
      )}

      {view === AppView.STUDY_PLAN && currentUser && (
        <StudyPlanView
            isPremium={currentUser.isPremium}
            onUpgradeClick={() => {
                setPremiumReason('REPORT_LOCKED');
                setShowPremiumModal(true);
            }}
            onBack={() => setView(AppView.HOME)}
        />
      )}

      {view === AppView.ESSAY && currentUser && (
          <EssayCorrectionView 
            credits={currentUser.essayCredits}
            onBuyCredits={() => setShowEssayCreditModal(true)}
            onBack={() => setView(AppView.HOME)}
            onConsumeCredit={handleConsumeCredit}
          />
      )}

      {view === AppView.QUIZ && (
        <div className="fixed inset-0 z-50 bg-game-bg max-w-md mx-auto">
          <QuizView 
            initialQuestions={activeQuestions} 
            mode={quizMode} 
            targetSubject={quizSubject}
            onExit={handleQuizExit} 
          />
        </div>
      )}

      {/* HUD Navigation */}
      {view !== AppView.QUIZ && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto h-16 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl flex justify-around items-center px-2 z-40 shadow-2xl">
           <div className="flex-1 h-full">
            <NavItem 
              targetView={AppView.HOME} 
              label="Base" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={view === AppView.HOME ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              } 
            />
           </div>

           <div className="flex-1 h-full">
            <NavItem 
              targetView={AppView.REPORT} 
              label="Mentor" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={view === AppView.REPORT ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              } 
            />
           </div>
           
           {/* Center Play Button */}
           <div className="relative -top-6">
             <button 
              onClick={() => startQuiz('MINI_CHALLENGE')}
              className="w-16 h-16 bg-gradient-to-t from-cyan-600 to-indigo-500 rounded-full border-4 border-slate-900 shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center text-white transform active:scale-95 transition-transform group"
             >
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 filter drop-shadow-md" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
             </button>
           </div>

           <div className="flex-1 h-full">
            <NavItem 
              targetView={AppView.LEADERBOARD} 
              label="Rank" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={view === AppView.LEADERBOARD ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              } 
            />
           </div>
        </div>
      )}
    </div>
  );
};
export default App;