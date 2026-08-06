'use client';

import { useState } from 'react';
import { CaptchaWidget } from '../components/captcha/captcha-widget';

export default function CaptchaPreviewPage() {
  const [rayId, setRayId] = useState('');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '6px', textAlign: 'center' }}>
          CAPTCHA Verification
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px', textAlign: 'center' }}>
          Click the checkbox to verify you are human — the challenge opens in a popup
        </p>

        {/* Main Demo Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>Name</label>
            <input
              type="text"
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--bg)',
                color: 'var(--text)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--bg)',
                color: 'var(--text)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>Message</label>
            <textarea
              placeholder="Your message..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                fontSize: '14px',
                background: 'var(--bg)',
                color: 'var(--text)',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* CAPTCHA Widget — forceShow always displays the checkbox for the preview */}
          <div style={{ marginBottom: '20px' }}>
            <CaptchaWidget
              apiBase="http://localhost:3000/api/captcha"
              forceShow
              onSuccess={(rid) => setRayId(rid || '')}
            />
          </div>

          {rayId && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'var(--success-surface)',
                border: '1px solid var(--success)',
                fontSize: '13px',
                color: 'var(--success)',
                fontWeight: 500,
              }}
            >
              ✓ Verified — Ray ID: <code style={{ fontFamily: 'monospace' }}>{rayId}</code>
            </div>
          )}

          <button
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--text)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </div>

        {/* Info Card */}
        <div
          style={{
            background: 'var(--bg-surface)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            border: '1px solid var(--border)',
          }}
        >
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>Challenge Types</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {['Math', 'Word', 'Emoji', 'Image Select', 'Logic', 'Color', 'Shape', 'Memory', 'Text'].map(t => (
              <span
                key={t}
                style={{
                  padding: '4px 10px',
                  background: 'var(--bg-muted)',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginTop: '16px', marginBottom: '12px' }}>Security Features</h3>
          <ul style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '18px', lineHeight: '1.8' }}>
            <li>Risk-based difficulty adjustment</li>
            <li>Behavioral analysis (mouse, typing, scroll)</li>
            <li>Device fingerprinting</li>
            <li>Ray ID tracking for admin review</li>
            <li>Auto-block after 3 failed attempts</li>
            <li>Server-side token verification</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
