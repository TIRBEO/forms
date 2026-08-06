'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, getLoginUrl, accountsUrl, User } from '../../lib/auth';
import { api } from '../../lib/api-client';
import { cn } from '../../lib/utils';
import {
  FileText, Plus, Search, Grid3X3,
  Clock, BarChart3, Users, Eye, MessageSquare, Star, UserPlus, ShoppingCart,
  CheckCircle2, AlertCircle, FolderOpen, Sparkles,
} from 'lucide-react';
import { DashboardShell } from '@tirbeo/ui';

const ALL_CATEGORIES = ['All', 'Surveys', 'Contact', 'Orders', 'Registration', 'Feedback'];

const TEMPLATE_DATA = [
  { id: 't1', name: 'Contact Us', description: 'Standard contact form with name, email, subject, and message fields.', category: 'Contact', fields: 4, responses: 1280, icon: MessageSquare },
  { id: 't2', name: 'Customer Feedback', description: 'Collect detailed feedback with satisfaction ratings and open-ended questions.', category: 'Feedback', fields: 6, responses: 3450, icon: Star },
  { id: 't3', name: 'Event Registration', description: 'Register attendees for events with name, email, ticket type, and dietary preferences.', category: 'Registration', fields: 7, responses: 892, icon: UserPlus },
  { id: 't4', name: 'Product Order', description: 'Simple product order form with item selection, quantities, and shipping details.', category: 'Orders', fields: 5, responses: 2100, icon: ShoppingCart },
  { id: 't5', name: 'Employee Survey', description: 'Annual employee satisfaction survey with anonymous response collection.', category: 'Surveys', fields: 12, responses: 543, icon: BarChart3 },
  { id: 't6', name: 'Support Ticket', description: 'Submit support requests with priority level, category, and detailed description.', category: 'Contact', fields: 6, responses: 4320, icon: MessageSquare },
  { id: 't7', name: 'Newsletter Signup', description: 'Collect email addresses and preferences for newsletter subscriptions.', category: 'Registration', fields: 3, responses: 8900, icon: UserPlus },
  { id: 't8', name: 'Satisfaction Survey', description: 'Post-purchase satisfaction survey with product ratings and delivery feedback.', category: 'Feedback', fields: 8, responses: 1567, icon: Star },
  { id: 't9', name: 'Volunteer Registration', description: 'Volunteer sign-up form with availability, skills, and emergency contact.', category: 'Registration', fields: 9, responses: 234, icon: UserPlus },
  { id: 't10', name: 'Order Customization', description: 'Custom product order form with size, color, and personalization options.', category: 'Orders', fields: 7, responses: 789, icon: ShoppingCart },
];

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
];

export default function TemplatesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<any>({ brand: { name: 'Tirbeo', logo: null } });
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All');
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

  const filtered = TEMPLATE_DATA.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || t.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <DashboardShell navSections={NAV_SECTIONS} brand={config.brand} user={user}
      onLogout={() => { window.location.href = accountsUrl('/logout'); }}
      onNavigate={href => router.push(href)} currentPath={pathname || '/templates'}
      onSearch={query => { if (query.trim()) router.push(`/?q=${encodeURIComponent(query)}`); }}
      searchPlaceholder="Search your forms, templates..."
      searchGroups={NAV_SECTIONS.map(section => ({ label: section.label, items: section.items.map(item => ({ label: item.label, href: item.href, icon: item.icon })) }))}>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-[28px] font-semibold text-[var(--color-text)] leading-tight">Templates</h1>
              <p className="mt-1 text-[var(--color-text-secondary)]">Choose from {TEMPLATE_DATA.length} pre-built templates to get started quickly</p>
            </div>

            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
              {ALL_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={cn(
                    'px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                    category === cat
                      ? 'bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
                  )}>
                  {cat}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
                <Grid3X3 className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
                <h3 className="text-lg font-medium text-[var(--color-text)] mb-2">No templates found</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">Try a different search term or category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(t => (
                  <div key={t.id}
                    className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:shadow-[var(--shadow-card)] transition-shadow group flex flex-col">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-surface)] flex items-center justify-center mb-4">
                      <t.icon className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-base font-medium text-[var(--color-text)] mb-1">{t.name}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4 flex-1">{t.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
                        {t.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[var(--color-text-tertiary)] mb-4">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{t.fields} fields</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{t.responses.toLocaleString()} responses</span>
                    </div>
                    <button
                       className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
                       <Sparkles className="w-3.5 h-3.5" />
                       Use Template
                     </button>
                  </div>
                ))}
              </div>
            )}
          </div>
      </DashboardShell>
  );
}
