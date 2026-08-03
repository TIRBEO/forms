'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getLoginUrl, User } from '../../lib/auth';
import { api } from '../../lib/api-client';
import { DashboardShell, type NavSection, type AppLink } from '@tirbeo/ui';
import { Save, UserCircle, Bell, Palette, Globe, Shield } from 'lucide-react';

const NAV_SECTIONS: NavSection[] = [
  { label: 'Overview', items: [{ href: '/', label: 'My Forms', icon: UserCircle }, { href: '/templates', label: 'Templates', icon: UserCircle }] },
  { label: 'Public', items: [{ href: '/public', label: 'Directory', icon: Globe }] },
  { label: 'Settings', items: [{ href: '/settings', label: 'General', icon: UserCircle }] },
];

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [config, setConfig] = useState<any>({});
  const [apps, setApps] = useState<AppLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    emailNotifications: true,
    defaultVisibility: 'private',
    theme: 'light',
  });

  useEffect(() => {
    getCurrentUser().then(u => {
      if (!u) { window.location.href = getLoginUrl(); return; }
      setUser(u);
      setForm(f => ({ ...f, name: u.name || '', email: u.email || '' }));
      setLoading(false);
    });
    api.get<{ config: any }>('/api/public/app-config?app=forms')
      .then(data => { if (data?.config) setConfig(data.config); })
      .catch(() => {});
    api.get<{ config: any }>('/api/public/app-config?app=_apps')
      .then(data => { if (data?.config?.apps) setApps(data.config.apps); })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch('/api/users/me', { name: form.name, email: form.email });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]"><div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" /></div>;
  }

  return (
    <DashboardShell navSections={NAV_SECTIONS} apps={apps} brand={config.brand} user={user}
      onLogout={() => { window.location.href = '/logout'; }}
      onNavigate={href => router.push(href)} currentPath="/settings"
      onSearch={query => { if (query.trim()) router.push(`/?q=${encodeURIComponent(query)}`); }}
      searchPlaceholder="Search your forms, templates..."
      searchGroups={NAV_SECTIONS.map(section => ({ label: section.label, items: section.items.map(item => ({ label: item.label, href: item.href, icon: item.icon })) }))}>
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <h1 className="text-[28px] font-semibold text-[var(--color-text)] leading-tight mb-1">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">Manage your account and form preferences</p>

        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="p-5 border-b border-[var(--color-border)]">
              <h2 className="text-base font-semibold text-[var(--color-text)] flex items-center gap-2"><UserCircle className="w-4 h-4" /> Profile</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Your personal information</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Display name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm outline-none focus:border-[var(--color-primary)]" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="p-5 border-b border-[var(--color-border)]">
              <h2 className="text-base font-semibold text-[var(--color-text)] flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Email notification preferences</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">Email notifications</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">Receive emails about form responses and updates</p>
                </div>
                <button onClick={() => setForm({ ...form, emailNotifications: !form.emailNotifications })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.emailNotifications ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-muted)]'}`}>
                  <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${form.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="p-5 border-b border-[var(--color-border)]">
              <h2 className="text-base font-semibold text-[var(--color-text)] flex items-center gap-2"><Globe className="w-4 h-4" /> Defaults</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Default settings for new forms</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--color-text)] mb-1.5 block">Default visibility</label>
                <select value={form.defaultVisibility} onChange={e => setForm({ ...form, defaultVisibility: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm outline-none focus:border-[var(--color-primary)]">
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          {saved && <span className="text-sm text-[var(--color-success)]">Saved successfully</span>}
          <button onClick={() => router.back()} className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save changes</>}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
