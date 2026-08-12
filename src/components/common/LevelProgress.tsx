import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { calculateLevel, calculateNextLevelXP } from '../../utils/gamification';

interface LevelProgressProps {
  xp: number;
  level?: number;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ xp, level: propLevel }) => {
  const level = propLevel || calculateLevel(xp);
  const nextLevelXP = calculateNextLevelXP(level);
  const progress = Math.min((xp / nextLevelXP) * 100, 100);

  return (
    <motion.div
      className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold dark:text-white">Niveau {level}</h3>
            <p className="text-sm text-gray-500 dark:text-dark-muted">
              {xp} / {nextLevelXP} XP
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold dark:text-white">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-dark-surface rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};