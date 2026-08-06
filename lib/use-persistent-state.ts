'use client';

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

// Namespaced + versioned so schema changes invalidate stale drafts automatically.
const KEY_PREFIX = 'tirbeo:v1:';

function readStored<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * useState that persists to localStorage. SSR-safe, hydration-safe: the first
 * render always uses the default (matching server HTML), then the stored value
 * is applied after mount. Never use for passwords/secret values.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() =>
    typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue
  );
  const hydrated = useRef(false);

  // Apply the stored value once, after mount (avoids hydration mismatch).
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const stored = readStored<T>(key);
    if (stored !== null) {
      setValue(stored);
      try {
        window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(stored));
      } catch {
        // best-effort
      }
    }
  }, [key]);

  // Persist subsequent changes only after hydration.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage disabled — persistence is best-effort.
    }
  }, [key, value]);

  return [value, setValue];
}

/** Remove one or more persisted keys (e.g. after a form is created). */
export function clearPersistentState(...keys: string[]) {
  if (typeof window === 'undefined') return;
  for (const key of keys) {
    try {
      window.localStorage.removeItem(KEY_PREFIX + key);
    } catch {
      // ignore
    }
  }
}
