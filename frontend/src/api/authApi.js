import { httpClient } from './httpClient.js';

export const authApi = {
  signup: (payload) => httpClient.post('/auth/signup', payload).then((r) => r.data),
  login: (payload) => httpClient.post('/auth/login', payload).then((r) => r.data),
  me: () => httpClient.get('/auth/me').then((r) => r.data),
};
