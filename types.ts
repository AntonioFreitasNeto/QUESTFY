export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  year?: number;
  subject: string; // e.g., "Matemática", "Ciências Humanas"
  source: 'ENEM_STATIC' | 'AI_GENERATED';
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar: string;
  score: number;
  streak: number;
  city: string;
  state: string;
  rankGlobal: number;
  rankState: number;
  rankCity: number;
  isPremium: boolean;
  questionsAnswered: number;
}

export enum LeaderboardScope {
  GLOBAL = 'GLOBAL',
  STATE = 'STATE',
  CITY = 'CITY'
}

export enum AppView {
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  LEADERBOARD = 'LEADERBOARD',
  REPORT = 'REPORT'
}

export interface QuizSession {
  mode: 'GLOBAL_CHALLENGE' | 'MINI_CHALLENGE';
  score: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  questions: Question[];
}

export interface SubjectPerformance {
  subject: string;
  correct: number;
  total: number;
}