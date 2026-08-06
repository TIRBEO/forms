'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn, formatDateTime, formatRelativeDate } from '../../../../lib/utils';
import {
  Activity, FileText, Users, Settings, Globe, Edit3,
  Archive, Trash2, RefreshCw, UserPlus, Download,
  Filter, Eye, Bell,
} from 'lucide-react';

interface ActivityEvent {
  id: string;
  type: string;
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

const EVENT_ICONS: Record<string, any> = {
  created: FileText,
  updated: Edit3,
  published: Globe,
  response_received: Users,
  collaborator_added: UserPlus,
  collaborator_removed: UserPlus,
  archived: Archive,
  deleted: Trash2,
  restored: RefreshCw,
  viewed: Eye,
  exported: Download,
  notified: Bell,
};

const EVENT_COLORS: Record<string, string> = {
  created: 'text-[var(--color-primary)]',
  updated: 'text-[var(--color-primary)]',
  published: 'text-[var(--color-success)]',
  response_received: 'text-[var(--color-primary)]',
  collaborator_added: 'text-[var(--color-warning)]',
  collaborator_removed: 'text-[var(--color-error)]',
  archived: 'text-[var(--color-text-tertiary)]',
  deleted: 'text-[var(--color-error)]',
  restored: 'text-[var(--color-success)]',
  viewed: 'text-[var(--color-text-secondary)]',
  exported: 'text-[var(--color-text-secondary)]',
  notified: 'text-[var(--color-primary)]',
};

const EVENT_TYPES = [
  'all', 'created', 'updated', 'published', 'response_received',
  'collaborator_added', 'archived', 'restored', 'exported',
];


export default function ActivityPage() {
  const params = useParams();
  const id = params.id as string;
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get<{ events: ActivityEvent[] }>(`/api/forms/${id}/activity`)
      .then(d => { setEvents(d.events || []); setLoading(false); })
  }, [id]);

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">Activity</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Audit log of all form events</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {EVENT_TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={cn(
              'whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filter === t
                ? 'bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
            )}>
            {t === 'all' ? 'All events' : t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <Activity className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No activity yet</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">Events will appear here as you work on your form</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-[var(--color-border)]" />
          <div className="space-y-0">
            {filteredEvents.map((event, idx) => {
              const Icon = EVENT_ICONS[event.type] || Activity;
              const color = EVENT_COLORS[event.type] || 'text-[var(--color-text-secondary)]';
              return (
                <div key={event.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
                  <div className={cn(
                    'relative z-10 w-10 h-10 rounded-full border-2 border-[var(--color-bg)] bg-[var(--color-surface)] flex items-center justify-center shrink-0',
                  )}>
                    <Icon className={cn('w-4 h-4', color)} />
                  </div>
                  <div className="flex-1 min-w-0 pt-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">{event.description}</p>
                        <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                          by <span className="font-medium text-[var(--color-text-secondary)]">{event.user}</span>
                          {' '}&middot; {formatRelativeDate(event.timestamp)}
                        </p>
                      </div>
                      <span className="text-[10px] text-[var(--color-text-tertiary)] whitespace-nowrap">
                        {formatDateTime(event.timestamp)}
                      </span>
                    </div>
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                        {Object.entries(event.metadata).map(([k, v]) => (
                          <span key={k} className="px-2 py-0.5 rounded bg-[var(--color-surface-muted)]">
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
