'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getLoginUrl } from '../../lib/auth';
import { api } from '../../lib/api-client';
import { formatRelativeDate } from '../../lib/utils';
import {
  ArrowLeft, Send, CheckCircle2, Inbox, Loader2,
} from 'lucide-react';

interface MyForm {
  id: string;
  title: string;
  description?: string;
  publicId: string;
  status: string;
  responseCount: number;
  mySubmissions: number;
  lastSubmittedAt: string;
  updatedAt: string;
}

export default function MyResponsesPage() {
  const router = useRouter();
  const [forms, setForms] = useState<MyForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(u => {
      if (!u) { window.location.href = getLoginUrl(); return; }
      api.get<{ forms: MyForm[] }>('/api/forms/my-responses')
        .then(d => setForms(d.forms || []))
        .catch(() => setForms([]))
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <button onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to My Forms
        </button>

        <h1 className="text-[28px] font-semibold text-[var(--color-text)] leading-tight mb-1">My Responses</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">Forms you have submitted responses to</p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
          </div>
        ) : forms.length === 0 ? (
          <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center shadow-brutal-sm">
            <Inbox className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-1">No responses yet</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Browse public forms and submit your first response</p>
            <button onClick={() => router.push('/public')}
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium shadow-brutal-sm hover:bg-[var(--color-primary-hover)] hover:shadow-brutal transition-all">
              Browse Public Forms
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {forms.map(form => (
              <div key={form.id}
                className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-brutal-sm hover:border-[var(--color-primary-border)] hover:shadow-brutal transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-[var(--color-primary)]" />
                      <h3 className="text-sm font-semibold text-[var(--color-text)] truncate">{form.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {form.mySubmissions} {form.mySubmissions === 1 ? 'submission' : 'submissions'}
                      </span>
                      <span>Last {formatRelativeDate(form.lastSubmittedAt)}</span>
                      {form.description && <span className="truncate hidden sm:inline">· {form.description}</span>}
                    </div>
                  </div>
                  <button onClick={() => router.push(`/a/${form.publicId}`)}
                    className="inline-flex shrink-0 items-center gap-2 px-4 py-2 border-2 bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium shadow-brutal-sm hover:bg-[var(--color-primary-hover)] hover:shadow-brutal transition-all">
                    <Send className="w-3.5 h-3.5" />
                    Fill again
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
