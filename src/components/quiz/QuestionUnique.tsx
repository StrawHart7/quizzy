import React, { useState } from 'react';
import type { Question } from '../../types';

interface QuestionUniqueProps {
  question: Question;
  onSelect: (answer: string) => void;
  selectedAnswer?: string;
  isReadOnly?: boolean;
}

export const QuestionUnique: React.FC<QuestionUniqueProps> = ({
  question,
  onSelect,
  selectedAnswer = '',
  isReadOnly = false
}) => {
  const [selected, setSelected] = useState<string>(selectedAnswer);

  const handleSelect = (option: string) => {
    if (isReadOnly) return;
    setSelected(option);
    onSelect(option);
  };

  return (
    <div className="space-y-3">
      <p className="font-medium text-gray-700 dark:text-[#b0b0c8]">
        Choisissez une seule réponse :
      </p>
      <div className="space-y-2">
        {question.options?.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              selected === option
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-[#2a2a4a] hover:bg-gray-50 dark:hover:bg-[#2a2a4a]/50'
            } ${isReadOnly ? 'cursor-default' : ''}`}
          >
            <input
              type="radio"
              name="unique-answer"
              checked={selected === option}
              onChange={() => handleSelect(option)}
              disabled={isReadOnly}
              className="w-4 h-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <span className="ml-3 text-gray-700 dark:text-[#e8e8f0]">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};