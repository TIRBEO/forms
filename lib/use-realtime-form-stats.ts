'use client';

import { useEffect, useRef, useState } from 'react';

function wsUrl(): string {
  if (typeof window === 'undefined') return '';
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
  }
  return process.env.NEXT_PUBLIC_WS_URL || 'wss://api.tirbeo.app';
}

/**
 * Live per-form analytics stream. Authenticates with the same access token the
 * API client stores, so the owner (and collaborators) see views/responses tick
 * up in real time as respondents hit the public form.
 */
export function useRealtimeFormStats(
  formId: string | undefined,
  onStats: (delta: { views?: number; responses?: number }) => void
): { connected: boolean } {
  const [connected, setConnected] = useState(false);
  const cbRef = useRef(onStats);
  cbRef.current = onStats;

  useEffect(() => {
    if (!formId) return;
    let ws: WebSocket | null = null;
    let closed = false;
    let retry = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleReconnect = () => {
      if (closed) return;
      retry = Math.min(retry + 1, 6);
      reconnectTimer = setTimeout(connect, Math.min(1000 * retry, 30000));
    };

    const connect = () => {
      if (closed) return;
      let token: string | null = null;
      try {
        token = window.localStorage.getItem('auth_token');
      } catch {}
      if (!token) return; // not signed in — nothing to stream

      try {
        ws = new WebSocket(wsUrl());
      } catch {
        scheduleReconnect();
        return;
      }

      ws.onopen = () => {
        retry = 0;
        ws?.send(JSON.stringify({ type: 'auth', token }));
      };

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(String(ev.data));
          if (msg.type === 'auth_ok') {
            setConnected(true);
            return;
          }
          if (msg.type === 'ping') {
            ws?.send(JSON.stringify({ type: 'pong' }));
            return;
          }
          if (msg.type === 'form:stats' && msg.formId === formId) {
            cbRef.current?.({ views: msg.views, responses: msg.responses });
          }
        } catch {}
      };

      ws.onclose = () => {
        setConnected(false);
        scheduleReconnect();
      };
      ws.onerror = () => {
        try {
          ws?.close();
        } catch {}
      };
    };

    connect();
    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      try {
        ws?.close();
      } catch {}
    };
  }, [formId]);

  return { connected };
}
