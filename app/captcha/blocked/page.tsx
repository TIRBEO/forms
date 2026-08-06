'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, Clock, MessageSquare, Mail, RefreshCcw } from 'lucide-react';

function CaptchaBlockedContent() {
  const searchParams = useSearchParams();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const rayId = searchParams.get('rayId') || 'unknown';
  const reason = searchParams.get('reason') || 'suspicious_activity';
  const expiresAt = searchParams.get('expiresAt');
  const blockedAt = searchParams.get('blockedAt');

  // Total block duration (seconds) so the progress bar has a denominator.
  const totalSeconds = useMemo(() => {
    if (expiresAt && blockedAt) {
      const total = (new Date(expiresAt).getTime() - new Date(blockedAt).getTime()) / 1000;
      if (Number.isFinite(total) && total > 0) return Math.round(total);
    }
    return null;
  }, [expiresAt, blockedAt]);

  useEffect(() => {
    if (expiresAt) {
      const updateTime = () => {
        const now = Date.now();
        const expiry = new Date(expiresAt).getTime();
        const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
        setTimeRemaining(remaining);
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [expiresAt]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const mailtoHref = `mailto:support@tirbeo.app?subject=${encodeURIComponent('Access Blocked - Ray ID ' + rayId)}&body=${encodeURIComponent(
    `I believe my access was blocked in error.\n\nRay ID: ${rayId}\nReason: ${reason}\n\n(Add details here)`
  )}`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-md w-full">
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--error-surface)] flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" style={{ color: 'var(--error)' }} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Access Blocked</h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--error-surface)] text-[var(--error)] rounded-full text-sm font-medium mb-4">
            <AlertTriangle className="w-4 h-4" />
            Error 4404
          </div>

          <p className="text-[var(--text-muted)] mb-6">
            Your access has been temporarily blocked due to suspicious activity. The block is reviewed by our security team.
          </p>

          <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-4 mb-6 space-y-2 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Ray ID:</span>
              <span className="font-mono text-[var(--text)]">{rayId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-muted)]">Reason:</span>
              <span className="text-[var(--text)] capitalize">{reason.replace(/_/g, ' ')}</span>
            </div>
            {timeRemaining !== null && (
              <div className="pt-1">
                {timeRemaining > 0 ? (
                  <>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[var(--text-muted)]">Auto-unlock</span>
                      <span className="font-mono text-[var(--text)] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-muted)] border border-[var(--border)]">
                      <div
                        className="h-full rounded-full transition-[width] duration-1000 ease-linear"
                        style={{
                          width: totalSeconds
                            ? `${Math.min(100, (timeRemaining / totalSeconds) * 100)}%`
                            : '100%',
                          background:
                            timeRemaining < 60
                              ? 'var(--error)'
                              : timeRemaining < 300
                                ? 'var(--warning)'
                                : 'var(--success)',
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="pt-1">
                    <p className="text-sm font-medium text-[var(--success)] mb-2">
                      The block has expired — you can try again now.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="btn-primary w-full justify-center"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      Retry now
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-[var(--border)] pt-4 space-y-3">
            <p className="text-sm text-[var(--text-muted)]">
              If you believe this is an error, submit an appeal and our team will review it.
            </p>
            <div className="flex flex-col gap-2">
              <a href={mailtoHref} className="btn-primary">
                <MessageSquare className="w-4 h-4" />
                Submit Appeal
              </a>
              <a
                href={mailtoHref}
                className="btn-secondary"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] inline-flex items-center justify-center gap-1.5"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Check again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CaptchaBlockedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <CaptchaBlockedContent />
    </Suspense>
  );
}
