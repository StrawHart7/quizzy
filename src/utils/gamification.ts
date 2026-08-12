import type { Score, Badge } from '../types';

export const XP_PER_LEVEL = 100;
export const XP_PER_QUIZ = 10;
export const XP_PER_CORRECT_ANSWER = 5;
export const XP_STREAK_BONUS = 20;

export const BADGES: Badge[] = [
  {
    id: 'first-quiz',
    name: 'Premier pas',
    description: 'Compléter votre premier quiz',
    icon: 'Target',
    condition: (scores: Score[]) => scores.length >= 1,
  },
  {
    id: 'perfect-score',
    name: 'Perfectionniste',
    description: 'Obtenir 100% à un quiz',
    icon: 'Award',
    condition: (scores: Score[]) => scores.some(s => s.percentage === 100),
  },
  {
    id: 'quiz-master',
    name: 'Maître des quiz',
    description: 'Compléter 10 quiz',
    icon: 'Trophy',
    condition: (scores: Score[]) => scores.length >= 10,
  },
  {
    id: 'streak-5',
    name: 'Série de 5',
    description: '5 quiz réussis d\'affilée',
    icon: 'Flame',
    condition: (scores: Score[]) => {
      const passed = scores.filter(s => s.percentage >= 60);
      let streak = 0;
      for (const s of passed) {
        streak++;
        if (streak >= 5) return true;
      }
      return false;
    },
  },
  {
    id: 'diverse-quiz',
    name: 'Explorateur',
    description: 'Compléter des quiz dans 3 catégories différentes',
    icon: 'Globe',
    condition: (scores: Score[]) => {
      const categories = new Set(scores.map(s => s.quizId));
      return categories.size >= 3;
    },
  },
  {
    id: 'fast-learner',
    name: 'Apprenti rapide',
    description: 'Terminer un quiz en moins de 2 minutes',
    icon: 'Zap',
    condition: (scores: Score[]) => scores.some(s => s.timeSpent < 120 && s.percentage >= 60),
  },
  {
    id: 'consistent',
    name: 'Régulier',
    description: 'Compléter 5 quiz avec au moins 70%',
    icon: 'TrendingUp',
    condition: (scores: Score[]) => {
      const goodScores = scores.filter(s => s.percentage >= 70);
      return goodScores.length >= 5;
    },
  },
  {
    id: 'diverse-quiz-5',
    name: 'Polyvalent',
    description: 'Compléter des quiz dans 5 catégories différentes',
    icon: 'Layers',
    condition: (scores: Score[]) => {
      const categories = new Set(scores.map(s => s.quizId));
      return categories.size >= 5;
    },
  },
];

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
};

export const calculateNextLevelXP = (level: number): number => {
  return level * XP_PER_LEVEL;
};

export const calculateXP = (score: Score): number => {
  let xp = XP_PER_QUIZ;
  xp += score.answers.filter(a => a.isCorrect).length * XP_PER_CORRECT_ANSWER;
  if (score.percentage === 100) xp += 20;
  if (score.timeSpent < 120) xp += 10;
  if (score.percentage >= 80) xp += 15;
  return xp;
};

export const checkBadges = (scores: Score[], currentBadges: string[]): string[] => {
  const newBadges: string[] = [];
  for (const badge of BADGES) {
    if (!currentBadges.includes(badge.id) && badge.condition(scores)) {
      newBadges.push(badge.id);
    }
  }
  return newBadges;
};

export const getBadgeById = (id: string): Badge | undefined => {
  return BADGES.find(b => b.id === id);
};

export const getBadgesByUser = (scores: Score[]): Badge[] => {
  return BADGES.filter(b => b.condition(scores));
};

export const getNextLevelProgress = (xp: number): { current: number; next: number; progress: number } => {
  const currentLevel = calculateLevel(xp);
  const currentLevelXP = (currentLevel - 1) * XP_PER_LEVEL;
  const nextLevelXP = currentLevel * XP_PER_LEVEL;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  return {
    current: currentLevel,
    next: nextLevelXP,
    progress: Math.min(progress, 100),
  };
};