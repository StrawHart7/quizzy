export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher' | 'student'; // <-- AJOUT
  createdAt: Date;
  scores?: Score[];
  quizzes?: Quiz[]; // Quiz créés par l'utilisateur
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
  createdBy: string; // ID de l'utilisateur qui a créé le quiz
  createdByUsername?: string; // Nom de l'utilisateur
  createdAt: Date;
  questions: Question[];
  difficulty: 'facile' | 'moyen' | 'difficile';
  timeLimit?: number;
  category: string;
  isPublic?: boolean; // <-- AJOUT : quiz public ou privé
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

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (scores: Score[]) => boolean;
}

export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  lastActivity: Date;
  quizzesCompleted: number;
  perfectScores: number;
}