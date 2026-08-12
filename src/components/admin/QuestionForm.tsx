import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import type { Question } from '../../types';

interface QuestionFormProps {
  question?: Question;
  onSubmit: (data: Omit<Question, 'id'>) => void;
  onCancel: () => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ question, onSubmit, onCancel }) => {
  const [type, setType] = useState<'qcm' | 'unique' | 'vf'>(question?.type || 'unique');
  const [text, setText] = useState(question?.text || '');
  const [options, setOptions] = useState<string[]>(question?.options || ['']);
  const [correctAnswer, setCorrectAnswer] = useState<string | string[]>(
    question?.correctAnswer || ''
  );
  const [explanation, setExplanation] = useState(question?.explanation || '');
  const [points, setPoints] = useState(question?.points || 10);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, value: string) => {
    setOptions(options.map((opt, i) => i === index ? value : opt));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredOptions = options.filter(opt => opt.trim() !== '');
    onSubmit({
      type,
      text,
      options: type === 'vf' ? undefined : filteredOptions,
      correctAnswer: type === 'qcm' 
        ? (correctAnswer as string).split(',').map(s => s.trim())
        : correctAnswer,
      explanation: explanation || undefined,
      difficulty: 'facile',
      points
    });
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {question ? 'Modifier la question' : 'Ajouter une question'}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de question
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="unique">Réponse unique</option>
            <option value="qcm">QCM (réponses multiples)</option>
            <option value="vf">Vrai / Faux</option>
          </select>
        </div>

        <Input
          label="Question"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Votre question ici"
          required
        />

        {type !== 'vf' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Options
            </label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                {options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addOption}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Ajouter une option
            </button>
          </div>
        )}

        <Input
          label={type === 'qcm' ? 'Réponses correctes (séparées par des virgules)' : 'Réponse correcte'}
          value={typeof correctAnswer === 'string' ? correctAnswer : correctAnswer.join(', ')}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          placeholder={type === 'qcm' ? 'Réponse 1, Réponse 2' : 'Réponse correcte'}
          required
        />

        <Input
          label="Explication (optionnel)"
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explication de la réponse"
        />

        <Input
          label="Points"
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          min={1}
          max={50}
          required
        />

        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1" icon={<Plus className="w-4 h-4" />}>
            {question ? 'Mettre à jour' : 'Ajouter'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
        </div>
      </form>
    </Card>
  );
};