
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
  
  // User State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Modals
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumReason, setPremiumReason] = useState<'LIMIT_REACHED' | 'REPORT_LOCKED'>('LIMIT_REACHED');
  const [showEssayCreditModal, setShowEssayCreditModal] = useState(false);

  const handleLogin = (name: string, isGoogle: boolean) => {
    // Mock login logic
    const mockUser = MOCK_USERS.find(u => u.id === 'you');
    if (mockUser) {
        const updatedUser = { 
            ...mockUser, 
            name: name,
            avatar: isGoogle 
                ? 'https://lh3.googleusercontent.com/a/ACg8ocL5y9Xy=s96-c' // Generic Google-like avatar
                : mockUser.avatar
        };
        setCurrentUser(updatedUser);
        setView(AppView.HOME);
    }
  };

  const startQuiz = (mode: 'GLOBAL_CHALLENGE' | 'MINI_CHALLENGE', subject?: string) => {
    if (!currentUser) return;

    // PAYWALL CHECK for Free Users
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
        // If subject is selected, try to find static questions first, otherwise start empty and let AI generate
        if (subject) {
            const filtered = STATIC_QUESTIONS.filter(q => q.subject === subject);
            setActiveQuestions(filtered);
        } else {
            setActiveQuestions([]); // Start empty for random mini challenge, let AI fill
        }
    }
    setView(AppView.QUIZ);
  };

  const handleQuizExit = (score: number, questionsAnsweredSession: number) => {
    // Save score and update usage count
    if (currentUser) {
        const updatedUser = {
            ...currentUser,
            score: currentUser.score + score,
            questionsAnswered: currentUser.questionsAnswered + questionsAnsweredSession
        };
        setCurrentUser(updatedUser);
    }
    
    alert(`Desafio finalizado! Você ganhou ${score} XP!`);
    setView(AppView.HOME);
  };

  const handleUpgrade = () => {
    // Simulate payment subscription
    if (currentUser) {
        setCurrentUser({ ...currentUser, isPremium: true });
        setShowPremiumModal(false);
        alert('Parabéns! Você agora é Premium! 👑');
    }
  };

  const handleBuyCredits = (amount: number) => {
      // Simulate credit purchase
      if (currentUser) {
          setCurrentUser({ ...currentUser, essayCredits: currentUser.essayCredits + amount });
          setShowEssayCreditModal(false);
          alert(`Você comprou ${amount} créditos de redação!`);
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
      className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${view === targetView ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );

  if (view === AppView.LOGIN) {
      return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden">
      
      {/* Subscription Modal */}
      <PremiumModal 
        isOpen={showPremiumModal} 
        onClose={() => setShowPremiumModal(false)} 
        onUpgrade={handleUpgrade}
        reason={premiumReason}
      />

      {/* Credit Purchase Modal */}
      <EssayCreditModal 
        isOpen={showEssayCreditModal}
        onClose={() => setShowEssayCreditModal(false)}
        onBuy={handleBuyCredits}
      />

      {/* Screen Router */}
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
                setPremiumReason('REPORT_LOCKED'); // Reusing reason for simplicity
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

      {/* Quiz covers the whole screen, no nav bar */}
      {view === AppView.QUIZ && (
        <div className="fixed inset-0 z-50 bg-white max-w-md mx-auto">
          <QuizView 
            initialQuestions={activeQuestions} 
            mode={quizMode} 
            targetSubject={quizSubject}
            onExit={handleQuizExit} 
          />
        </div>
      )}

      {/* Bottom Navigation (Hidden in Quiz and Login) */}
      {view !== AppView.QUIZ && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-white border-t border-gray-200 flex justify-around items-center px-2 z-40 pb-2">
           <div className="flex-1 h-full">
            <NavItem 
              targetView={AppView.HOME} 
              label="Desafios" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={view === AppView.HOME ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={view === AppView.REPORT ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              } 
            />
           </div>
           
           {/* Center FAB for quick start */}
           <div className="relative -top-6">
             <button 
              onClick={() => startQuiz('MINI_CHALLENGE')}
              className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full shadow-lg shadow-primary-500/40 flex items-center justify-center text-white transform active:scale-95 transition-transform"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
             </button>
           </div>

           <div className="flex-1 h-full">
            <NavItem 
              targetView={AppView.LEADERBOARD} 
              label="Ranking" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={view === AppView.LEADERBOARD ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
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
