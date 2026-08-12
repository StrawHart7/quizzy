import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import type { Quiz } from '../../types';

interface QuizFormProps {
  quiz?: Quiz;
  onSubmit: (data: Omit<Quiz, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const QuizForm: React.FC<QuizFormProps> = ({ quiz, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(quiz?.title || '');
  const [description, setDescription] = useState(quiz?.description || '');
  const [category, setCategory] = useState(quiz?.category || '');
  const [difficulty, setDifficulty] = useState<'facile' | 'moyen' | 'difficile'>(
    quiz?.difficulty || 'facile'
  );
  const [timeLimit, setTimeLimit] = useState(quiz?.timeLimit || 300);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      category,
      difficulty,
      timeLimit,
      questions: quiz?.questions || [],
      createdBy: 'admin'
    });
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{quiz ? 'Modifier le quiz' : 'Créer un quiz'}</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du quiz"
          required
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du quiz"
          required
        />
        <Input
          label="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Programmation, Culture, etc."
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulté
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="facile">Facile</option>
              <option value="moyen">Moyen</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>
          <Input
            label="Temps limite (secondes)"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            min={60}
          />
        </div>
        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1" icon={<Plus className="w-4 h-4" />}>
            {quiz ? 'Mettre à jour' : 'Créer'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Annuler
          </Button>
        </div>
      </form>
    </Card>
  );
};