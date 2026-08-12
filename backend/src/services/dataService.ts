import fs from 'fs';
import path from 'path';
import { Quiz, Score, User } from '../types';

const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class DataService {
  private readFile<T>(filename: string): T[] {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  private writeFile<T>(filename: string, data: T[]): void {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  // Quiz methods
  getQuizzes(): Quiz[] {
    return this.readFile<Quiz>('quizzes.json');
  }

  saveQuizzes(quizzes: Quiz[]): void {
    this.writeFile('quizzes.json', quizzes);
  }

  getQuiz(id: string): Quiz | undefined {
    return this.getQuizzes().find(q => q.id === id);
  }

  addQuiz(quiz: Quiz): Quiz {
    const quizzes = this.getQuizzes();
    quizzes.push(quiz);
    this.saveQuizzes(quizzes);
    return quiz;
  }

  updateQuiz(id: string, quizData: Partial<Quiz>): Quiz | undefined {
    const quizzes = this.getQuizzes();
    const index = quizzes.findIndex(q => q.id === id);
    if (index === -1) return undefined;
    
    quizzes[index] = { ...quizzes[index], ...quizData };
    this.saveQuizzes(quizzes);
    return quizzes[index];
  }

  deleteQuiz(id: string): boolean {
    const quizzes = this.getQuizzes();
    const filtered = quizzes.filter(q => q.id !== id);
    if (filtered.length === quizzes.length) return false;
    this.saveQuizzes(filtered);
    return true;
  }

  // Question methods
  addQuestion(quizId: string, question: any): Quiz | undefined {
    const quizzes = this.getQuizzes();
    const quizIndex = quizzes.findIndex(q => q.id === quizId);
    if (quizIndex === -1) return undefined;
    
    quizzes[quizIndex].questions.push(question);
    this.saveQuizzes(quizzes);
    return quizzes[quizIndex];
  }

  updateQuestion(quizId: string, questionId: string, questionData: any): Quiz | undefined {
    const quizzes = this.getQuizzes();
    const quizIndex = quizzes.findIndex(q => q.id === quizId);
    if (quizIndex === -1) return undefined;
    
    const questionIndex = quizzes[quizIndex].questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return undefined;
    
    quizzes[quizIndex].questions[questionIndex] = { 
      ...quizzes[quizIndex].questions[questionIndex], 
      ...questionData 
    };
    this.saveQuizzes(quizzes);
    return quizzes[quizIndex];
  }

  deleteQuestion(quizId: string, questionId: string): Quiz | undefined {
    const quizzes = this.getQuizzes();
    const quizIndex = quizzes.findIndex(q => q.id === quizId);
    if (quizIndex === -1) return undefined;
    
    quizzes[quizIndex].questions = quizzes[quizIndex].questions.filter(q => q.id !== questionId);
    this.saveQuizzes(quizzes);
    return quizzes[quizIndex];
  }

  // Score methods
  getScores(): Score[] {
    return this.readFile<Score>('scores.json');
  }

  saveScore(score: Score): Score {
    const scores = this.getScores();
    scores.push(score);
    this.writeFile('scores.json', scores);
    return score;
  }

  getScoresByUser(userId: string): Score[] {
    return this.getScores().filter(s => s.userId === userId);
  }

  getScoresByQuiz(quizId: string): Score[] {
    return this.getScores().filter(s => s.quizId === quizId);
  }

  // User methods
  getUsers(): User[] {
    return this.readFile<User>('users.json');
  }

  
  // UserRole methods
  updateUserRole(userId: string, role: 'admin' | 'teacher' | 'student'): User | undefined {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return undefined;
    
    users[index].role = role;
    this.saveUsers(users);
    return users[index];
  }


  saveUsers(users: User[]): void {
    this.writeFile('users.json', users);
  }

  getUser(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  addUser(user: User): User {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
    return user;
  }
}

export default new DataService();