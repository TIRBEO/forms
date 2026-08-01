const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.tirbeo.app";

export interface ApiClientOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    this.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  }

  setHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method,
      headers: { ...this.headers, ...(options?.headers as Record<string, string>) },
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
      ...options,
    });

    if (!res.ok) {
      let errorBody: any;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = { message: res.statusText };
      }
      const err = new ApiClientError(
        errorBody?.error?.message || res.statusText,
        res.status,
        errorBody
      );
      throw err;
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  get<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>("POST", path, body, options);
  }

  patch<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>("PATCH", path, body, options);
  }

  put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>("PUT", path, body, options);
  }

  delete<T>(path: string, options?: RequestInit): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options);
  }
}

export class ApiClientError extends Error {
  statusCode: number;
  details?: Record<string, unknown>;

  constructor(message: string, statusCode: number, details?: Record<string, unknown>) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

export const apiClient = new ApiClient();