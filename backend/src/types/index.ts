export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student'; // <-- AJOUT
  createdAt: Date;
}

export interface Question {
  id: string;
  type: 'qcm' | 'unique' | 'vf';
  text: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  questions: Question[];
  difficulty: 'facile' | 'moyen' | 'difficile';
  timeLimit?: number;
  category: string;
}

export interface Answer {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}

export interface Score {
  userId: string;
  quizId: string;
  answers: Answer[];
  totalPoints: number;
  maxPoints: number;
  percentage: number;
  startTime: Date;
  endTime: Date;
  timeSpent: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}