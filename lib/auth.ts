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
  return `${accountsUrl('/login')}?redirect_to=${redirect}`;
}

/**
 * Dev/prod-aware accounts app URL. Local dev points at the accounts app
 * running on :3002; production uses the real accounts.tirbeo.app subdomain.
 */
export function accountsUrl(path = '/'): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.tirbeo.app';
  const isLocal = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (isLocal) return `http://localhost:3002${cleanPath}`;
  return `https://accounts.tirbeo.app${cleanPath}`;
}

export async function logout() {
  try { await api.post('/api/auth/logout'); } catch {}
  clearUser();
  if (typeof window !== 'undefined') window.location.href = getLoginUrl();
}
