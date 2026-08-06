'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getLoginUrl, accountsUrl, User } from '../lib/auth';
import { api } from '../lib/api-client';
import { formatRelativeDate, getStatusBadgeStyle, cn } from '../lib/utils';
import { DashboardShell, type NavSection, type AppLink } from '@tirbeo/ui';
import {
  FileText, Plus, Grid3X3, Eye, Search, MessageSquare,
  Clock, BarChart3, MoreHorizontal, Copy, Archive, FolderOpen,
} from 'lucide-react';

const RECENT_ACCOUNTS_KEY = 'forms_recent_accounts';
const MAX_RECENT_ACCOUNTS = 5;

function getRecentAccounts(): { name?: string; email?: string; photoUrl?: string }[] {
  try {
    const raw = localStorage.getItem(RECENT_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function addRecentAccount(account: { name?: string; email?: string; photoUrl?: string }) {
  try {
    const existing = getRecentAccounts().filter(a => a.email !== account.email);
    const updated = [account, ...existing].slice(0, MAX_RECENT_ACCOUNTS);
    localStorage.setItem(RECENT_ACCOUNTS_KEY, JSON.stringify(updated));
  } catch {}
}

function clearUserAndRedirect(email: string) {
  try { localStorage.removeItem('auth_token'); } catch {}
  window.location.href = `${accountsUrl('/login')}?email=${encodeURIComponent(email)}`;
}

interface Form {
  id: string;
  title: string;
  description?: string;
  status: string;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  fields?: any[];
}

const NAV_SECTIONS: NavSection[] = [
  { label: 'Overview', items: [{ href: '/', label: 'My Forms', icon: FileText }, { href: '/my-responses', label: 'My Responses', icon: MessageSquare }] },
  { label: 'Public', items: [{ href: '/public', label: 'Public Forms', icon: Eye }, { href: '/templates', label: 'Templates', icon: Grid3X3 }] },
];

export default function FormsDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [config, setConfig] = useState<any>({});
  const [apps, setApps] = useState<AppLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState<Form[]>([]);
  const [formsLoading, setFormsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [activeTab, setActiveTab] = useState<'my-forms' | 'assigned' | 'in-progress' | 'submitted' | 'saved'>('my-forms');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentUser().then(u => {
      if (!u) { window.location.href = getLoginUrl(); return; }
      setUser(u);
      if (u.email) addRecentAccount({ name: u.name, email: u.email, photoUrl: u.photoUrl });
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      api.get<{ forms: Form[] }>('/api/forms')
        .then(d => { setForms(d.forms || []); setFormsLoading(false); })
        .catch(() => setFormsLoading(false));
    }
  }, [loading]);

  useEffect(() => {
    api.get<{ config: any }>('/api/public/app-config?app=forms')
      .then(data => { if (data?.config) setConfig(data.config); })
      .catch(() => {});
    api.get<{ config: any }>('/api/public/app-config?app=_apps')
      .then(data => { if (data?.config?.apps) setApps(data.config.apps); })
      .catch(() => {});
  }, []);

  const filteredForms = forms.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabForms = {
    'my-forms': filteredForms,
    'assigned': [],
    'in-progress': filteredForms.filter(f => f.status === 'draft'),
    'submitted': [],
    'saved': filteredForms.filter(f => f.status === 'draft'),
  };

  const currentForms = tabForms[activeTab];

  const recentAccounts = user ? getRecentAccounts().filter(a => a.email !== user.email) : [];

  const handleSwitchAccount = (account: { name?: string; email?: string; photoUrl?: string }) => {
    if (account.email) clearUserAndRedirect(account.email);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]"><div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>;
  }

  return (
    <DashboardShell navSections={NAV_SECTIONS} apps={apps} brand={config.brand} user={user}
      onLogout={() => { window.location.href = accountsUrl('/logout'); }}
      onNavigate={href => router.push(href)} currentPath="/"
      onSearch={query => { if (query.trim()) router.push(`/?q=${encodeURIComponent(query)}`); }}
      searchPlaceholder="Search your forms, templates..."
      searchGroups={NAV_SECTIONS.map(section => ({ label: section.label, items: section.items.map(item => ({ label: item.label, href: item.href, icon: item.icon })) }))}
      recentAccounts={recentAccounts} onSwitchAccount={handleSwitchAccount}>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[28px] font-semibold text-[var(--color-text)] leading-tight">My Forms</h1>
            <p className="mt-1 text-[var(--color-text-secondary)]">{forms.length} total forms</p>
          </div>
          <button onClick={() => router.push('/create')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors shadow-[var(--shadow-card)]">
            <Plus className="w-4 h-4" /> New Form
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface-muted)] flex-1 max-w-sm min-w-[200px]">
            <Search className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <input type="text" placeholder="Search forms..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)]" />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {(['all', 'published', 'draft', 'archived'] as const).map(status => (
              <button key={status} onClick={() => setStatusFilter(status)}
                className={cn('px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  statusFilter === status ? 'bg-[var(--color-primary-surface)] text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                )}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && <span className="ml-1 text-xs opacity-60">{forms.filter(f => f.status === status).length}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {([{ key: 'my-forms', label: 'My Forms' }, { key: 'assigned', label: 'Assigned to me' }, { key: 'in-progress', label: 'In progress' }, { key: 'submitted', label: 'Submitted' }, { key: 'saved', label: 'Saved' }] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={cn('inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === tab.key ? 'bg-[var(--color-primary-surface)] text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
              )}>
              {tab.label}
              {tab.key === 'my-forms' && <span className="ml-1.5 text-xs opacity-60">{forms.length}</span>}
            </button>
          ))}
        </div>

        {formsLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5 animate-pulse"><div className="h-5 w-48 bg-[var(--color-surface-muted)] rounded mb-3" /><div className="h-4 w-32 bg-[var(--color-surface-muted)] rounded" /></div>)}</div>
        ) : currentForms.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-12 h-12 mx-auto text-[var(--color-text-tertiary)] mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-1">No forms found</h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Create your first form to get started</p>
             <button onClick={() => router.push('/create')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"><Plus className="w-4 h-4" /> Create Form</button>
          </div>
        ) : (
          <div className="space-y-3">
            {currentForms.map(form => {
              const isMenuOpen = menuOpen === form.id;
              return (
                <div key={form.id} className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-primary-border)] transition-colors cursor-pointer" onClick={() => router.push(`/f/${form.id}`)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className="text-sm font-semibold text-[var(--color-text)]">{form.title}</h3>
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium', getStatusBadgeStyle(form.status))}>{form.status}</span>
                      </div>
                      {form.description && <p className="text-xs text-[var(--color-text-secondary)] mb-3 line-clamp-1">{form.description}</p>}
                      <div className="flex items-center gap-4 text-[11px] text-[var(--color-text-tertiary)]">
                        <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" />{form.responseCount || 0} responses</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatRelativeDate(form.updatedAt)}</span>
                        {form.publishedAt && <span className="flex items-center gap-1"><Eye className="w-3 h-3" />Published</span>}
                      </div>
                    </div>
                    <div className="relative">
                      <button onClick={e => { e.stopPropagation(); setMenuOpen(isMenuOpen ? null : form.id); }}
                        className="p-1.5 rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                      {isMenuOpen && (
                        <><div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-full mt-1 z-20 w-44  border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] p-1.5">
                          <button onClick={() => { setMenuOpen(null); navigator.clipboard.writeText(`${window.location.origin}/f/${form.id}`); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] transition-colors"><Copy className="w-4 h-4" /> Copy link</button>
                          {form.status !== 'archived' && <button onClick={() => { setMenuOpen(null); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] transition-colors"><Archive className="w-4 h-4" /> Archive</button>}
                        </div></>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
