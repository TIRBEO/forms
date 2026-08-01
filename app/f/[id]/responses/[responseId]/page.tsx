'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../../lib/api-client';
import { formatDateTime } from '../../../../../lib/utils';
import {
  ArrowLeft, Trash2, Clock, Globe, Monitor, User,
  FileText, Mail, Hash, Calendar, Circle, CheckSquare,
  ChevronDown, Star, Upload, ToggleLeft, AlignLeft, Type,
  MessageSquare, AlertTriangle,
} from 'lucide-react';

interface AnswerDetail {
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
  value: string;
}

interface ResponseDetail {
  id: string;
  respondent?: string;
  submittedAt: string;
  duration?: number;
  ip?: string;
  userAgent?: string;
  answers: AnswerDetail[];
  notes?: string;
}

const FIELD_ICONS: Record<string, any> = {
  text: Type, textarea: AlignLeft, email: Mail, phone: Hash,
  number: Hash, date: Calendar, time: Calendar,
  select: ChevronDown, radio: Circle, checkbox: CheckSquare,
  rating: Star, file: Upload, toggle: ToggleLeft,
};


export default function ResponseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const responseId = params.responseId as string;
  const [data, setData] = useState<ResponseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    api.get<ResponseDetail>(`/api/forms/${id}/responses/${responseId}`)
      .then(d => { setData(d); setNotes(d.notes || ''); setLoading(false); })
  }, [id, responseId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-[var(--color-text-secondary)]">Response not found</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push(`/f/${id}/responses`)}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to responses
        </button>
        <button onClick={() => setShowDeleteConfirm(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-error)] hover:bg-[var(--color-error-surface)] transition-colors">
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="mb-6 rounded-xl border border-[var(--color-error)] bg-[var(--color-error-surface)] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[var(--color-error)] mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-text)]">Delete this response?</p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">This action cannot be undone.</p>
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => {}}
                  className="px-3 py-1.5 rounded-lg bg-[var(--color-error)] text-white text-sm font-medium hover:opacity-90 transition-colors">
                  Delete
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Submission details</h2>
          <span className="text-xs text-[var(--color-text-tertiary)]">ID: {data.id}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <User className="w-3.5 h-3.5" />
            <span>{data.respondent || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDateTime(data.submittedAt)}</span>
          </div>
          {data.duration && (
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <Clock className="w-3.5 h-3.5" />
              <span>{data.duration < 60 ? `${data.duration}s` : `${Math.floor(data.duration / 60)}m ${data.duration % 60}s`} to complete</span>
            </div>
          )}
          {data.ip && (
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <Globe className="w-3.5 h-3.5" />
              <span>IP: {data.ip}</span>
            </div>
          )}
        </div>
        {data.userAgent && (
          <div className="flex items-start gap-2 mt-3 text-xs text-[var(--color-text-tertiary)]">
            <Monitor className="w-3.5 h-3.5 mt-0.5" />
            <span className="break-all">{data.userAgent}</span>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {data.answers.map((answer, idx) => {
          const Icon = FIELD_ICONS[answer.fieldType] || FileText;
          return (
            <div key={answer.fieldId}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-sm font-medium text-[var(--color-text)]">{answer.fieldLabel}</span>
                <span className="text-xs text-[var(--color-text-tertiary)] ml-auto">{answer.fieldType}</span>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">{answer.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Notes</h2>
        </div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          className="w-full min-h-[80px] text-sm text-[var(--color-text)] bg-[var(--color-surface-muted)] rounded-lg border border-[var(--color-border)] p-3 outline-none resize-none placeholder:text-[var(--color-text-tertiary)]"
          placeholder="Add notes about this response..." />
      </div>
    </div>
  );
}
