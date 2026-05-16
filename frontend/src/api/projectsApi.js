import { httpClient } from './httpClient.js';

export const projectsApi = {
  list: () => httpClient.get('/projects').then((r) => r.data),
  get: (id) => httpClient.get(`/projects/${id}`).then((r) => r.data),
  create: (payload) => httpClient.post('/projects', payload).then((r) => r.data),
  update: (id, payload) => httpClient.patch(`/projects/${id}`, payload).then((r) => r.data),
  remove: (id) => httpClient.delete(`/projects/${id}`).then((r) => r.data),
  addMember: (id, payload) =>
    httpClient.post(`/projects/${id}/members`, payload).then((r) => r.data),
  removeMember: (id, userId) =>
    httpClient.delete(`/projects/${id}/members/${userId}`).then((r) => r.data),
};
