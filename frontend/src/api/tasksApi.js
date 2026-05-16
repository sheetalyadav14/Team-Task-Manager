import { httpClient } from './httpClient.js';

export const tasksApi = {
  forProject: (projectId, filters = {}) => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.assignee_id) params.assignee_id = filters.assignee_id;
    return httpClient.get(`/projects/${projectId}/tasks`, { params }).then((r) => r.data);
  },
  create: (projectId, payload) =>
    httpClient.post(`/projects/${projectId}/tasks`, payload).then((r) => r.data),
  update: (taskId, payload) =>
    httpClient.patch(`/tasks/${taskId}`, payload).then((r) => r.data),
  remove: (taskId) => httpClient.delete(`/tasks/${taskId}`).then((r) => r.data),
  mine: () => httpClient.get('/tasks/me').then((r) => r.data),
  stats: () => httpClient.get('/tasks/stats').then((r) => r.data),
};
