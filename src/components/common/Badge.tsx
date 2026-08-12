import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface BadgeProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BadgeComponent: React.FC<BadgeProps> = ({
  name,
  description,
  icon,
  unlocked = false,
  size = 'md',
}) => {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Badge;

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className={`relative ${sizes[size]} rounded-full flex items-center justify-center
          ${unlocked 
            ? 'bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] shadow-lg shadow-[#4f46e5]/30' 
            : 'bg-gray-200 dark:bg-[#2a2a4a] opacity-40'
          }
          transition-all duration-300`}
        whileHover={unlocked ? { scale: 1.1, rotate: 5 } : {}}
        title={unlocked ? `${name}: ${description}` : '🔒 Verrouillé'}
      >
        <IconComponent 
          className={`${iconSizes[size]} ${unlocked ? 'text-white' : 'text-gray-500 dark:text-[#6b6b85]'}`} 
        />
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[#4f46e5]/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.div>
      {unlocked && (
        <span className="text-xs font-medium text-[#334155] dark:text-[#b0b0c8] text-center max-w-[80px] truncate">
          {name}
        </span>
      )}
    </div>
  );
};