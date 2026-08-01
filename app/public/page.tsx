'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, getLoginUrl, User } from '../../lib/auth';
import { api } from '../../lib/api-client';
import { cn, formatDate } from '../../lib/utils';
import {
  FileText, Plus, Search, Grid3X3,
  Clock, BarChart3, Users, Eye, MessageSquare, Star, UserPlus, ShoppingCart,
  CheckCircle2, AlertCircle, FolderOpen, Globe, Lock, EyeOff, ExternalLink,
} from 'lucide-react';
import { DashboardShell } from '@tirbeo/ui';

const VISIBILITY_FILTERS = ['All', 'Public', 'Unlisted'] as const;
const CATEGORY_FILTERS = ['All', 'Surveys', 'Contact', 'Orders', 'Registration', 'Feedback'] as const;
const SORT_OPTIONS = [
  { value: 'responses', label: 'Most responses' },
  { value: 'recent', label: 'Recently created' },
  { value: 'alpha', label: 'Alphabetical' },
] as const;

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { href: '/', label: 'My Forms', icon: FileText },
      { href: '/templates', label: 'Templates', icon: Grid3X3 },
    ],
  },
  {
    label: 'Public',
    items: [
      { href: '/public', label: 'Directory', icon: Eye },
    ],
  },
  {
    label: 'Create',
    items: [
      { href: '/create', label: 'Create form', icon: Plus },
    ],
  },
];

export default function PublicDirectoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>({ brand: { name: 'Tirbeo', logo: null } });
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'All' | 'Public' | 'Unlisted'>('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'responses' | 'recent' | 'alpha'>('responses');
  const [forms, setForms] = useState<any[]>([]);
  const [formsLoading, setFormsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    Promise.all([
      getCurrentUser(),
      api.get('/api/public/app-config?app=forms').catch(() => null),
    ]).then(([u, cfg]) => {
      if (!u) { window.location.href = getLoginUrl(); return; }
      setUser(u);
      if (cfg) setConfig(cfg);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    setFormsLoading(true);
    api.get<{ forms: any[] }>('/api/forms?visibility=public&limit=100')
      .then(data => { setForms(data.forms || []); setFormsLoading(false); })
      .catch(() => { setForms([]); setFormsLoading(false); });
  }, [user]);

  const filtered = useMemo(() => {
    let result = forms;
    if (visibilityFilter !== 'All') {
      result = result.filter(f => f.visibility === visibilityFilter.toLowerCase());
    }
    if (categoryFilter !== 'All') {
      result = result.filter(f => f.category === categoryFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(f => f.title?.toLowerCase().includes(q) || f.description?.toLowerCase().includes(q));
    }
    result = [...result].sort((a, b) => {
      if (sortBy === 'responses') return (b.responseCount || b._count?.responses || 0) - (a.responseCount || a._count?.responses || 0);
      if (sortBy === 'recent') return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
      return (a.title || '').localeCompare(b.title || '');
    });
    return result;
  }, [forms, visibilityFilter, categoryFilter, searchQuery, sortBy]);

  if (loading || formsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <DashboardShell navSections={NAV_SECTIONS} brand={config.brand} user={user}
      onLogout={() => { window.location.href = '/logout'; }}
      onNavigate={href => router.push(href)} currentPath={pathname || '/public'}>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-[28px] font-semibold text-[var(--color-text)] leading-tight">Discover Forms</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Browse public forms and surveys from the community</p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {VISIBILITY_FILTERS.map(f => (
            <button key={f} onClick={() => setVisibilityFilter(f)}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors',
                visibilityFilter === f
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
              )}>
              {f === 'Public' ? <Globe className="w-3.5 h-3.5" /> : f === 'Unlisted' ? <Lock className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search forms..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-[var(--color-primary)]">
            {CATEGORY_FILTERS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm outline-none focus:border-[var(--color-primary)]">
            {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
            <h3 className="text-lg font-medium text-[var(--color-text)] mb-1">No forms found</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(f => (
              <div key={f.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:shadow-sm transition-shadow group flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-surface)] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                    f.visibility === 'public'
                      ? 'bg-[var(--color-success-surface)] text-[var(--color-success)]'
                      : 'bg-[var(--color-surface-muted)] text-[var(--color-text-tertiary)]'
                  )}>
                    {f.visibility === 'public' ? <Globe className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {f.visibility}
                  </span>
                </div>
                <h3 className="text-base font-medium text-[var(--color-text)] mb-1">{f.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3 flex-1">{f.description || ''}</p>
                <div className="flex items-center gap-2 mb-3">
                  {f.category && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-tertiary)]">{f.category}</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--color-text-tertiary)] mb-4">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{f.fields?.length || 0} fields</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(f.responseCount || f._count?.responses || 0).toLocaleString()} responses</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--color-text-tertiary)] mb-4">
                  <span>by {f.user?.displayName || f.user?.email || 'Unknown'}</span>
                  <span>Updated {new Date(f.updatedAt || f.createdAt).toLocaleDateString()}</span>
                </div>
                <button onClick={() => router.push(`/f/${f.publicId || f.id}`)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Fill Form
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
