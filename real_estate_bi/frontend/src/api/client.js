import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://vc80stqx-8000.euw.devtunnels.ms/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectApi = {
  createProject: (data) => apiClient.post('/projects/', data),
  getProjects: () => apiClient.get('/projects/'),
};

export const financeApi = {
  getBudget: () => apiClient.get('/finance/budget'),
  getProjectModel: (projectId) => apiClient.get(`/finance/project/${projectId}`),
};