'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { api } from '../../../lib/api-client';
import { cn, getStatusBadgeStyle } from '../../../lib/utils';
import { FileText, Eye, BarChart3, Users, Settings, ArrowLeft, ExternalLink, CheckCircle2 } from 'lucide-react';

interface Form {
  id: string;
  title: string;
  status: string;
  publicId: string;
  responseCount: number;
  viewCount: number;
}

const TABS = [
  { href: 'edit', label: 'Edit', icon: FileText },
  { href: 'overview', label: 'Overview', icon: Eye },
  { href: 'responses', label: 'Responses', icon: Users },
  { href: 'analytics', label: 'Analytics', icon: BarChart3 },
  { href: 'settings', label: 'Settings', icon: Settings },
];

export default function FormLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const id = params.id as string;
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    api.get<Form>(`/api/forms/${id}`).then(setForm).catch(() => {});
  }, [id]);

  const currentTab = TABS.find(t => pathname.includes(t.href))?.href || 'overview';

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="sticky top-0 z-20 bg-[var(--color-header)] border-b border-[var(--color-border)] backdrop-blur-md">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/')} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="font-semibold text-[var(--color-text)]">{form?.title || 'Loading...'}</span>
              {form && (
                <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', getStatusBadgeStyle(form.status))}>
                  {form.status}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-text-tertiary)]">{form?.responseCount || 0} responses</span>
            {form?.status === 'published' && (
              <button onClick={() => window.open(`/f/${form.publicId}`, '_blank')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                View live
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 px-6">
          {TABS.map(tab => (
            <button key={tab.href} onClick={() => router.push(`/f/${id}/${tab.href}`)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
                currentTab === tab.href
                  ? 'text-[var(--color-primary)] border-[var(--color-primary)]'
                  : 'text-[var(--color-text-secondary)] border-transparent hover:text-[var(--color-text)] hover:border-[var(--color-border)]'
              )}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
}
