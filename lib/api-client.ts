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

let refreshPromise: Promise<boolean> | null = null;

// Silent session refresh: the 30-day __refresh cookie (scoped to
// /api/auth/refresh) keeps users signed in across tabs and after the
// 15-minute access token expires — no re-login needed.
async function tryRefreshSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const headers: Record<string, string> = {};
      const csrf = getCsrf();
      if (csrf) headers['X-CSRF-Token'] = csrf;
      const res = await fetch(`${API}/api/auth/refresh`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });
      if (!res.ok) {
        try { window.localStorage.removeItem('auth_token'); } catch {}
        return false;
      }
      const data = await res.json().catch(() => ({}));
      if (data?.token) {
        try { window.localStorage.setItem('auth_token', data.token); } catch {}
      }
      return true;
    } catch {
      return false;
    } finally {
      setTimeout(() => { refreshPromise = null; }, 250);
    }
  })();
  return refreshPromise;
}

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options: RequestInit = {}, retried = false): Promise<T> {
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
    if (
      res.status === 401 &&
      !retried &&
      path !== '/api/auth/refresh' &&
      path !== '/api/auth/login' &&
      path !== '/api/auth/signup'
    ) {
      if (await tryRefreshSession()) {
        return request<T>(path, options, true);
      }
    }
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
  download: async (path: string, fallbackName = 'download') => {
    const headers: Record<string, string> = {};
    const bearer = getBearerToken();
    if (bearer) headers['Authorization'] = `Bearer ${bearer}`;
    const res = await fetch(`${API}${path}`, { headers, credentials: 'include' });
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
    const blob = await res.blob();
    const disposition = res.headers.get('Content-Disposition') || '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    const name = match?.[1] || fallbackName;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};
