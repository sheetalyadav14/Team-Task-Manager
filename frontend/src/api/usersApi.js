import { httpClient } from './httpClient.js';

export const usersApi = {
  list: () => httpClient.get('/users').then((r) => r.data),
};
