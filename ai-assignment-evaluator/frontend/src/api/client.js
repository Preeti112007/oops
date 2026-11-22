import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password, role) => api.post('/auth/register', { name, email, password, role }),
  getCurrentUser: () => api.get('/auth/me'),
};

export const assignmentApi = {
  getAll: () => api.get('/assignments'),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (data) => api.post('/assignments', data),
  update: (id, data) => api.put(`/assignments/${id}`, data),
  delete: (id) => api.delete(`/assignments/${id}`),
  search: (query) => api.get(`/assignments/search?q=${encodeURIComponent(query || '')}`),
};

export const submissionApi = {
  submit: (assignmentId, answerText) => api.post('/submissions', { assignmentId, answerText }),
  getByStudent: (studentId) => api.get(`/submissions/student/${studentId}`),
  getByAssignment: (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`),
  getById: (id) => api.get(`/submissions/${id}`),
};

export const evaluationApi = {
  evaluate: (submissionId, force = false) => api.post(`/evaluations/evaluate/${submissionId}?force=${force}`),
  getBySubmissionId: (submissionId) => api.get(`/evaluations/${submissionId}`),
  getByStudentId: (studentId) => api.get(`/evaluations/student/${studentId}`),
  review: (evaluationId, data) => api.put(`/evaluations/${evaluationId}/review`, data),
};

export const teacherApi = {
  getDashboardStats: () => api.get('/teacher/dashboard'),
  getAllSubmissions: () => api.get('/teacher/submissions'),
  exportCsvUrl: () => `${api.defaults.baseURL}/teacher/export-csv`,
  downloadCsv: () => api.get('/teacher/export-csv', { responseType: 'blob' }),
};

export default api;
