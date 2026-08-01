export const API = (() => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3000';
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.tirbeo.app';
})();

function getCsrf(): string {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/(?:^|;\s*)__csrf=([^;]+)/);
  return match?.[1] || '';
}

function getBearerToken(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const urlToken = new URLSearchParams(window.location.hash.slice(1)).get('token');
  if (urlToken) {
    try { window.localStorage.setItem('auth_token', urlToken); } catch {}
    window.location.hash = '';
    return urlToken;
  }
  try { return window.localStorage.getItem('auth_token') || undefined; } catch { return undefined; }
}

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) };
  const method = (options.method || 'GET').toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    headers['X-CSRF-Token'] = getCsrf();
  }
  const bearer = getBearerToken();
  if (bearer) headers['Authorization'] = `Bearer ${bearer}`;
  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    let body: any;
    try { body = await res.json(); } catch { body = {}; }
    throw new ApiError(
      res.status,
      body?.error?.code || 'UNKNOWN',
      body?.error?.message || res.statusText,
      body?.error?.fields,
    );
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
