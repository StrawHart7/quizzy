import React, { useState } from 'react';
import type { Question } from '../../types';

interface QuestionQCMProps {
  question: Question;
  onSelect: (answer: string[]) => void;
  selectedAnswer?: string[];
  isReadOnly?: boolean;
}

export const QuestionQCM: React.FC<QuestionQCMProps> = ({
  question,
  onSelect,
  selectedAnswer = [],
  isReadOnly = false
}) => {
  const [selected, setSelected] = useState<string[]>(selectedAnswer);

  const handleToggle = (option: string) => {
    if (isReadOnly) return;

    let newSelected: string[];
    if (selected.includes(option)) {
      newSelected = selected.filter(s => s !== option);
    } else {
      newSelected = [...selected, option];
    }
    setSelected(newSelected);
    onSelect(newSelected);
  };

  return (
    <div className="space-y-3">
      <p className="font-medium text-gray-700 dark:text-[#b0b0c8]">
        Choisissez toutes les réponses correctes :
      </p>
      <div className="space-y-2">
        {question.options?.map((option, index) => (
          <label
            key={index}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              selected.includes(option)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-[#2a2a4a] hover:bg-gray-50 dark:hover:bg-[#2a2a4a]/50'
            } ${isReadOnly ? 'cursor-default' : ''}`}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              disabled={isReadOnly}
              className="w-4 h-4 text-blue-600 dark:text-blue-400 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
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