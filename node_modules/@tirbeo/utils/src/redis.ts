const store = new Map<string, { value: string; expiresAt: number }>();

export async function setCache(key: string, value: string, ttl: number = 300) {
  const expiresAt = Date.now() + ttl * 1000;
  store.set(key, { value, expiresAt });
}

export async function getCache(key: string): Promise<string | null> {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export async function delCache(key: string) {
  store.delete(key);
}