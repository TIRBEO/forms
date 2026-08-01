import { api, ApiError } from './api-client';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  adminRole?: string | null;
}

let currentUser: User | null = null;
let fetchPromise: Promise<User | null> | null = null;

export async function getCurrentUser(): Promise<User | null> {
  if (currentUser) return currentUser;
  if (fetchPromise) return fetchPromise;
  fetchPromise = (async () => {
    try {
      const data = await api.get<any>('/api/users/me');
      currentUser = data || null;
      return currentUser;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return null;
      return null;
    } finally {
      fetchPromise = null;
    }
  })();
  return fetchPromise;
}

export function clearUser() { currentUser = null; }

export function getLoginUrl() {
  const redirect = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  return `https://accounts.tirbeo.app/login?redirect_to=${redirect}`;
}

export async function logout() {
  try { await api.post('/api/auth/logout'); } catch {}
  clearUser();
  if (typeof window !== 'undefined') window.location.href = getLoginUrl();
}
