import type { Quiz } from '../types';

export const sampleQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Introduction à la Programmation',
    description: 'Testez vos connaissances de base en programmation',
    createdBy: 'admin',
    createdAt: new Date('2026-01-15'),
    category: 'Programmation',
    difficulty: 'facile',
    timeLimit: 300, // 5 minutes
    questions: [
      {
        id: 'q1',
        type: 'qcm',
        text: 'Qu\'est-ce qu\'une variable en programmation ?',
        options: [
          'Un espace de stockage pour des données',
          'Une fonction qui retourne une valeur',
          'Une boucle qui répète des instructions',
          'Un type de données spécifique'
        ],
        correctAnswer: ['Un espace de stockage pour des données'],
        explanation: 'Une variable est un conteneur qui stocke des données en mémoire.',
        difficulty: 'facile',
        points: 10
      },
      {
        id: 'q2',
        type: 'unique',
        text: 'Quel est le résultat de 2 + 2 en programmation ?',
        options: ['3', '4', '5', '22'],
        correctAnswer: '4',
        explanation: 'En programmation, l\'addition fonctionne comme en mathématiques.',
        difficulty: 'facile',
        points: 10
      },
      {
        id: 'q3',
        type: 'vf',
        text: 'JavaScript est un langage compilé.',
        correctAnswer: 'false',
        explanation: 'JavaScript est un langage interprété, pas compilé.',
        difficulty: 'facile',
        points: 10
      },
      {
        id: 'q4',
        type: 'qcm',
        text: 'Parmi ces langages, lesquels sont orientés objet ?',
        options: ['Java', 'Python', 'C', 'JavaScript'],
        correctAnswer: ['Java', 'Python', 'JavaScript'],
        explanation: 'Java, Python et JavaScript supportent la programmation orientée objet.',
        difficulty: 'moyen',
        points: 15
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Culture Générale',
    description: 'Testez vos connaissances en culture générale',
    createdBy: 'admin',
    createdAt: new Date('2026-02-01'),
    category: 'Culture',
    difficulty: 'moyen',
    timeLimit: 420, // 7 minutes
    questions: [
      {
        id: 'q5',
        type: 'unique',
        text: 'Quelle est la capitale de la France ?',
        options: ['Londres', 'Paris', 'Berlin', 'Madrid'],
        correctAnswer: 'Paris',
        explanation: 'Paris est la capitale de la France.',
        difficulty: 'facile',
        points: 10
      },
      {
        id: 'q6',
        type: 'vf',
        text: 'La Terre est plate.',
        correctAnswer: 'false',
        explanation: 'La Terre est une sphère, pas plate.',
        difficulty: 'facile',
        points: 10
      },
      {
        id: 'q7',
        type: 'qcm',
        text: 'Parmi ces planètes, lesquelles sont gazeuses ?',
        options: ['Jupiter', 'Saturne', 'Mars', 'Vénus'],
        correctAnswer: ['Jupiter', 'Saturne'],
        explanation: 'Jupiter et Saturne sont des planètes gazeuses.',
        difficulty: 'difficile',
        points: 20
      }
    ]
  }
];