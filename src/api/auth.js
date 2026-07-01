import { apiFetch } from './config';

export const loginRequest = (email, password) =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }, true);

export const logoutRequest = () =>
  apiFetch('/auth/logout', { method: 'POST' });