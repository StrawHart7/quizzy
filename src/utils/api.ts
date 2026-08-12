const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Une erreur est survenue');
  }
  return data;
};

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    return handleResponse(response);
  },

  getUsers: async (token: string) => {
    console.log('getUsers appelé avec token:', token ? 'Présent' : 'Manquant');
    const response = await fetch(`${API_URL}/auth/users`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  getUserInfo: async (token: string) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  // Quizzes
  getQuizzes: async () => {
    const response = await fetch(`${API_URL}/quizzes`);
    return handleResponse(response);
  },

  getQuiz: async (id: string) => {
    const response = await fetch(`${API_URL}/quizzes/${id}`);
    return handleResponse(response);
  },

  createQuiz: async (quizData: any, token: string) => {
    const response = await fetch(`${API_URL}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(quizData)
    });
    return handleResponse(response);
  },

  updateQuiz: async (id: string, quizData: any, token: string) => {
    const response = await fetch(`${API_URL}/quizzes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(quizData)
    });
    return handleResponse(response);
  },

  deleteQuiz: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/quizzes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Questions
  addQuestion: async (quizId: string, questionData: any, token: string) => {
    const response = await fetch(`${API_URL}/quizzes/${quizId}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(questionData)
    });
    return handleResponse(response);
  },

  updateQuestion: async (quizId: string, questionId: string, questionData: any, token: string) => {
    const response = await fetch(`${API_URL}/quizzes/${quizId}/questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(questionData)
    });
    return handleResponse(response);
  },

  deleteQuestion: async (quizId: string, questionId: string, token: string) => {
    const response = await fetch(`${API_URL}/quizzes/${quizId}/questions/${questionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  // Scores
  saveScore: async (scoreData: any, token?: string) => {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_URL}/scores`, {
      method: 'POST',
      headers,
      body: JSON.stringify(scoreData)
    });
    return handleResponse(response);
  },

  getScores: async (token: string) => {
    console.log('getScores appelé avec token:', token ? 'Présent' : 'Manquant');
    const response = await fetch(`${API_URL}/scores`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  getUserScores: async (userId: string, token: string) => {
    const response = await fetch(`${API_URL}/scores/user/${userId}`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  // Payment
  createPaymentTransaction: async (token: string) => {
    const response = await fetch(`${API_URL}/payment/create-transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return handleResponse(response);
  },

  verifyPayment: async (transactionId: string, token: string) => {
    const response = await fetch(`${API_URL}/payment/verify/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  getTeacherStatus: async (token: string) => {
    const response = await fetch(`${API_URL}/payment/teacher-status`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  },

  // Test FedaPay (admin only)
  testFedaPay: async (token: string) => {
    const response = await fetch(`${API_URL}/payment/test`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  }
};