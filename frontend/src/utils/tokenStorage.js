import { TOKEN_STORAGE_KEY } from '../constants/auth';

export const getToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const hasToken = () => Boolean(getToken());
