'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Bell, HelpCircle, Search, ChevronDown, ChevronRight } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  perm?: string;
}

export interface AdminShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  user?: { name?: string; email?: string; photoUrl?: string; role?: string } | null;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
  onNavigate: (href: string) => void;
  currentPath: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function AdminShell({ children, navItems, user, onSearch, onLogout, onNavigate, currentPath, breadcrumbs }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => currentPath === href || currentPath.startsWith(href + '/');

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.href);
    const expanded = expandedItems[item.label];

    return (
      <div key={item.href}>
        <button
          onClick={() => {
            if (item.children) { toggleExpand(item.label); }
            else { onNavigate(item.href); setSidebarOpen(false); }
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            active && !item.children
              ? 'bg-[var(--color-admin-sidebar-active)] text-[var(--color-primary)]'
              : 'text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-sidebar-hover)] hover:text-[var(--color-admin-text)]'
          } ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? item.label : undefined}
        >
          <item.icon className={`w-4 h-4 flex-shrink-0 ${active && !item.children ? 'text-[var(--color-primary)]' : ''}`} />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {item.children && (
                expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />
              )}
            </>
          )}
        </button>
        {!collapsed && item.children && expanded && (
          <div className="ml-6 mt-0.5 space-y-0.5">
            {item.children.map(child => (
              <button key={child.href} onClick={() => { onNavigate(child.href); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(child.href)
                    ? 'bg-[var(--color-admin-sidebar-active)] text-[var(--color-primary)]'
                    : 'text-[var(--color-admin-text-secondary)] hover:bg-[var(--color-admin-sidebar-hover)] hover:text-[var(--color-admin-text)]'
                }`}>
                <child.icon className="w-3.5 h-3.5" />
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-admin-bg)]">
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setSearchOpen(false)}>
          <div className="max-w-xl mx-auto mt-24" onClick={e => e.stopPropagation()}>
            <div className="bg-[var(--color-admin-surface)] rounded-xl shadow-lg border border-[var(--color-admin-border)] overflow-hidden">
              <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--color-admin-border)]">
                <Search className="w-5 h-5 text-[var(--color-admin-text-muted)]" />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search users, groups or settings..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--color-admin-text)] placeholder:text-[var(--color-admin-text-muted)]"
                  autoFocus />
                <span className="text-xs text-[var(--color-admin-text-muted)] bg-[var(--color-admin-surface-hover)] px-1.5 py-0.5 rounded">ESC</span>
              </div>
              {searchQuery && (
                <div className="p-2 max-h-80 overflow-y-auto">
                  <div className="px-3 py-2 text-xs font-medium text-[var(--color-admin-text-muted)] uppercase">No results</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-30 bg-[var(--color-admin-sidebar)] border-r border-[var(--color-admin-border)] transform transition-all duration-200 ${
        collapsed ? 'w-[72px]' : 'w-60'
      } lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className={`flex items-center h-16 border-b border-[var(--color-admin-border)] ${collapsed ? 'justify-center px-2' : 'px-6 gap-3'}`}>
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">T</div>
            {!collapsed && <span className="font-semibold text-[var(--color-admin-text)] text-lg">Admin OS</span>}
          </div>
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
            {navItems.map(renderNavItem)}
          </nav>
          <div className={`border-t border-[var(--color-admin-border)] p-3 ${collapsed ? 'text-center' : ''}`}>
            <button onClick={() => setCollapsed(!collapsed)}
              className="w-full text-xs text-[var(--color-admin-text-muted)] hover:text-[var(--color-admin-text-secondary)] transition-colors">
              {collapsed ? '→' : 'Collapse'}
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 h-16 bg-[var(--color-admin-topbar)] border-b border-[var(--color-admin-border)] backdrop-blur-md flex items-center px-4 lg:px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--color-admin-surface-hover)] text-[var(--color-admin-text-secondary)]">
            <Menu className="w-5 h-5" />
          </button>
          <button onClick={() => setSearchOpen(true)}
            className="hidden sm:flex flex-1 max-w-md items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-admin-surface-hover)] text-[var(--color-admin-text-muted)] text-sm border border-[var(--color-admin-border)] hover:border-[var(--color-admin-text-muted)] transition-colors cursor-text">
            <Search className="w-4 h-4" />
            <span>Search users, groups or settings...</span>
            <span className="ml-auto text-xs bg-[var(--color-admin-surface)] px-1.5 py-0.5 rounded border border-[var(--color-admin-border)]">⌘K</span>
          </button>
          <div className="flex-1 sm:hidden" />
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-[var(--color-admin-surface-hover)] text-[var(--color-admin-text-secondary)] transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-error)]" />
            </button>
            <button className="p-2 rounded-lg hover:bg-[var(--color-admin-surface-hover)] text-[var(--color-admin-text-secondary)] transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 pl-3 ml-3 border-l border-[var(--color-admin-border)]">
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary-surface)] flex items-center justify-center text-[var(--color-primary)] font-medium text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              {!collapsed && (
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-[var(--color-admin-text)] leading-tight">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-[var(--color-admin-text-muted)]">{user?.role || ''}</p>
                </div>
              )}
            </div>
          </div>
        </header>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 px-6 py-2 text-xs text-[var(--color-admin-text-muted)] border-b border-[var(--color-admin-border)]">
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>/</span>}
                {bc.href ? (
                  <button onClick={() => onNavigate(bc.href!)} className="hover:text-[var(--color-admin-text)] transition-colors">{bc.label}</button>
                ) : (
                  <span className="text-[var(--color-admin-text-secondary)]">{bc.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
