import React, { useState } from 'react';
import type { Question } from '../../types';

interface QuestionVFProps {
  question: Question;
  onSelect: (answer: string) => void;
  selectedAnswer?: string;
  isReadOnly?: boolean;
}

export const QuestionVF: React.FC<QuestionVFProps> = ({
  onSelect,
  selectedAnswer = '',
  isReadOnly = false
}) => {
  const [selected, setSelected] = useState<string>(selectedAnswer);

  const handleSelect = (value: string) => {
    if (isReadOnly) return;
    setSelected(value);
    onSelect(value);
  };

  const options = [
    { value: 'true', label: 'Vrai', color: 'green' },
    { value: 'false', label: 'Faux', color: 'red' }
  ];

  return (
    <div className="space-y-3">
      <p className="font-medium text-gray-700 dark:text-[#b0b0c8]">
        Choisissez Vrai ou Faux :
      </p>
      <div className="grid grid-cols-2 gap-4">
        {options.map(({ value, label, color }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            disabled={isReadOnly}
            className={`p-4 border-2 rounded-lg transition-colors ${
              selected === value
                ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20`
                : 'border-gray-200 dark:border-[#2a2a4a] hover:bg-gray-50 dark:hover:bg-[#2a2a4a]/50'
            } ${isReadOnly ? 'cursor-default' : ''}`}
          >
            <span className={`font-medium text-${color}-600 dark:text-${color}-400`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};