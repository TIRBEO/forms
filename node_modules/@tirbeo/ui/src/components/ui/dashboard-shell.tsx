"use client";

import { useState, useEffect } from "react";
import { Menu, ChevronDown, ChevronRight, Search, Bell, HelpCircle } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface AppLink {
  id: string;
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface DashboardShellProps {
  children: React.ReactNode;
  navSections: NavSection[];
  footerLinks?: NavItem[];
  apps?: AppLink[];
  brand?: { name?: string; logo?: string };
  user?: { name?: string; email?: string; role?: string; photoUrl?: string } | null;
  onLogout?: () => void;
  onNavigate: (href: string) => void;
  currentPath: string;
  onSearch?: (query: string) => void;
  breadcrumbs?: { label: string; href?: string }[];
  collapsible?: boolean;
  recentAccounts?: { name?: string; email?: string; photoUrl?: string }[];
  onSwitchAccount?: (account: { name?: string; email?: string; photoUrl?: string }) => void;
}

export function DashboardShell({
  children,
  navSections,
  footerLinks = [],
  apps = [],
  brand,
  user,
  onLogout,
  onNavigate,
  currentPath,
  onSearch,
  breadcrumbs,
  collapsible = false,
  recentAccounts = [],
  onSwitchAccount,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [appsMenuOpen, setAppsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const first = navSections[0];
    if (first && expandedSections[first.label] === undefined) {
      setExpandedSections({ [first.label]: true });
    }
  }, []);

  const isActive = (href: string) => {
    if (href === "/" || href === "") return currentPath === href;
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  const toggleSection = (label: string) => {
    setExpandedSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const sidebarWidth = collapsible && collapsed ? "w-[72px]" : "w-64";

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg,var(--color-admin-bg,#F8F9FA))]">
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setSearchOpen(false)}>
          <div className="max-w-xl mx-auto mt-24" onClick={e => e.stopPropagation()}>
            <div className="bg-[var(--color-surface,var(--color-admin-surface,#FFFFFF))] rounded-xl shadow-lg border border-[var(--color-border,var(--color-admin-border,#DADCE0))] overflow-hidden">
              <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--color-border,var(--color-admin-border,#DADCE0))]">
                <Search className="w-5 h-5 text-[var(--color-text-secondary,var(--color-admin-text-muted,#80868B))]" />
                <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); onSearch?.(e.target.value); }}
                  placeholder="Search..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--color-text,var(--color-admin-text,#202124))] placeholder:text-[var(--color-text-secondary,var(--color-admin-text-muted,#80868B))]"
                  autoFocus />
                <span className="text-xs text-[var(--color-text-secondary,var(--color-admin-text-muted,#80868B))] bg-[var(--color-surface-muted,var(--color-admin-surface-hover,#F1F3F4))] px-1.5 py-0.5 rounded">ESC</span>
              </div>
              {searchQuery && (
                <div className="p-2 max-h-80 overflow-y-auto">
                  <div className="px-3 py-2 text-xs font-medium text-[var(--color-text-secondary,var(--color-admin-text-muted,#80868B))] uppercase">No results</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-30 bg-[var(--color-sidebar,var(--color-admin-sidebar,#FFFFFF))] border-r border-[var(--color-border,var(--color-admin-border,#DADCE0))] transform transition-all duration-200 ${sidebarWidth} lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className={`flex items-center h-16 border-b border-[var(--color-border,var(--color-admin-border,#DADCE0))] flex-shrink-0 ${collapsible && collapsed ? "justify-center px-2" : "px-6 gap-3"}`}>
            {brand?.logo ? (
              <img src={brand.logo} alt="" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary,#1A73E8)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {(brand?.name || "T").charAt(0)}
              </div>
            )}
            {!(collapsible && collapsed) && (
              <span className="font-semibold text-[var(--color-text,var(--color-admin-text,#202124))] text-lg truncate">{brand?.name || "Tirbeo"}</span>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
            {navSections.map(section => (
              <div key={section.label}>
                {!(collapsible && collapsed) && (
                  <button
                    onClick={() => toggleSection(section.label)}
                    className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] uppercase tracking-wider hover:text-[var(--color-text,var(--color-admin-text,#202124))] transition-colors"
                  >
                    {section.label}
                    {expandedSections[section.label] ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                )}
                {(collapsible && collapsed) || expandedSections[section.label] ? (
                  <div className={`${collapsible && collapsed ? "" : "mt-1 space-y-0.5"}`}>
                    {section.items.map(item => {
                      const active = isActive(item.href);
                      if (item.children) {
                        return (
                          <div key={item.href}>
                            <button
                              onClick={() => { if (collapsible && collapsed) { onNavigate(item.href); setSidebarOpen(false); } else { toggleSection(item.label); } }}
                              className={`w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                                collapsible && collapsed ? "justify-center px-2 py-3" : "px-3 py-2"
                              } ${
                                active && !item.children
                                  ? "bg-[var(--color-sidebar-active,var(--color-admin-sidebar-active,#E8F0FE))] text-[var(--color-primary,#1A73E8)]"
                                  : "text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] hover:bg-[var(--color-sidebar-hover,var(--color-admin-sidebar-hover,#F1F3F4))] hover:text-[var(--color-text,var(--color-admin-text,#202124))]"
                              }`}
                              title={collapsible && collapsed ? item.label : undefined}
                            >
                              <item.icon className={`w-4 h-4 flex-shrink-0 ${active && !item.children ? "text-[var(--color-primary,#1A73E8)]" : ""}`} />
                              {!(collapsible && collapsed) && (
                                <>
                                  <span className="flex-1 text-left">{item.label}</span>
                                  {expandedSections[item.label] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                </>
                              )}
                            </button>
                            {!(collapsible && collapsed) && expandedSections[item.label] && (
                              <div className="ml-6 mt-0.5 space-y-0.5">
                                {item.children.map(child => (
                                  <button key={child.href}
                                    onClick={() => { onNavigate(child.href); setSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                      isActive(child.href)
                                        ? "bg-[var(--color-sidebar-active,var(--color-admin-sidebar-active,#E8F0FE))] text-[var(--color-primary,#1A73E8)]"
                                        : "text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] hover:bg-[var(--color-sidebar-hover,var(--color-admin-sidebar-hover,#F1F3F4))] hover:text-[var(--color-text,var(--color-admin-text,#202124))]"
                                    }`}
                                  >
                                    <child.icon className="w-3.5 h-3.5" />
                                    {child.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return (
                        <button
                          key={item.href}
                          onClick={() => { onNavigate(item.href); setSidebarOpen(false); }}
                          className={`w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                            collapsible && collapsed ? "justify-center px-2 py-3" : "px-3 py-2"
                          } ${
                            active
                              ? "bg-[var(--color-sidebar-active,var(--color-admin-sidebar-active,#E8F0FE))] text-[var(--color-primary,#1A73E8)]"
                              : "text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] hover:bg-[var(--color-sidebar-hover,var(--color-admin-sidebar-hover,#F1F3F4))] hover:text-[var(--color-text,var(--color-admin-text,#202124))]"
                          }`}
                          title={collapsible && collapsed ? item.label : undefined}
                        >
                          <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[var(--color-primary,#1A73E8)]" : ""}`} />
                          {!(collapsible && collapsed) && (
                            <span className="flex-1 text-left">{item.label}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          {footerLinks.length > 0 && (
            <div className={`border-t border-[var(--color-border,var(--color-admin-border,#DADCE0))] p-3 space-y-0.5 ${collapsible && collapsed ? "text-center" : ""}`}>
              {footerLinks.map(link => {
                const active = isActive(link.href);
                return (
                  <button key={link.href}
                    onClick={() => { onNavigate(link.href); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors ${
                      collapsible && collapsed ? "justify-center px-2 py-3" : "px-3 py-2"
                    } ${
                      active
                        ? "bg-[var(--color-sidebar-active,var(--color-admin-sidebar-active,#E8F0FE))] text-[var(--color-primary,#1A73E8)]"
                        : "text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] hover:bg-[var(--color-sidebar-hover,var(--color-admin-sidebar-hover,#F1F3F4))] hover:text-[var(--color-text,var(--color-admin-text,#202124))]"
                    }`}
                    title={collapsible && collapsed ? link.label : undefined}
                  >
                    <link.icon className="w-4 h-4 flex-shrink-0" />
                    {!(collapsible && collapsed) && <span className="flex-1 text-left">{link.label}</span>}
                  </button>
                );
              })}
            </div>
          )}

          {collapsible && (
            <div className={`border-t border-[var(--color-border,var(--color-admin-border,#DADCE0))] p-3 ${collapsed ? "text-center" : ""}`}>
              <button onClick={() => setCollapsed(!collapsed)}
                className="w-full text-xs text-[var(--color-text-secondary,var(--color-admin-text-muted,#80868B))] hover:text-[var(--color-text,var(--color-admin-text,#202124))] transition-colors">
                {collapsed ? "→" : "Collapse"}
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 h-16 bg-[var(--color-header,var(--color-admin-topbar,#FFFFFF))] border-b border-[var(--color-border,var(--color-admin-border,#DADCE0))] backdrop-blur-md flex items-center px-4 lg:px-6 gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--color-surface-muted,var(--color-admin-surface-hover,#F1F3F4))] text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 lg:hidden">
            {brand?.logo ? (
              <img src={brand.logo} alt="" className="h-7 w-7 rounded-lg object-contain flex-shrink-0" />
            ) : (
              <div className="h-7 w-7 rounded-lg bg-[var(--color-primary,#1A73E8)] flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {(brand?.name || "T").charAt(0)}
              </div>
            )}
            <span className="font-semibold text-[var(--color-text,var(--color-admin-text,#202124))] text-base truncate">{brand?.name || "Tirbeo"}</span>
          </div>

          {apps.length > 0 && (
            <div className="relative hidden sm:block">
              <button
                onClick={() => setAppsMenuOpen(!appsMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] hover:bg-[var(--color-surface-muted,var(--color-admin-surface-hover,#F1F3F4))] hover:text-[var(--color-text,var(--color-admin-text,#202124))] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                Apps
                <ChevronDown className={`w-3 h-3 transition-transform ${appsMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {appsMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setAppsMenuOpen(false)} />
                  <div className="absolute left-0 top-full mt-1 z-40 w-56 rounded-xl border border-[var(--color-border,var(--color-admin-border,#DADCE0))] bg-[var(--color-surface,var(--color-admin-surface,#FFFFFF))] shadow-lg p-2">
                    {apps.map(app => (
                      <a key={app.id}
                        href={app.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] hover:bg-[var(--color-surface-muted,var(--color-admin-surface-hover,#F1F3F4))] hover:text-[var(--color-text,var(--color-admin-text,#202124))] transition-colors"
                      >
                        {app.icon ? <app.icon className="w-4 h-4" /> : <div className="w-4 h-4 rounded bg-[var(--color-primary-surface,var(--color-admin-sidebar-active,#E8F0FE))] flex items-center justify-center text-[10px] font-bold text-[var(--color-primary,#1A73E8)]">{app.name.charAt(0)}</div>}
                        {app.name}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex-1" />

          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] bg-[var(--color-surface-muted,var(--color-admin-surface-hover,#F1F3F4))] hover:bg-[var(--color-surface-raised,var(--color-admin-surface,#FFFFFF))] transition-colors border border-transparent hover:border-[var(--color-border,var(--color-admin-border,#DADCE0))]"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">Search</span>
            <span className="text-xs bg-[var(--color-surface-raised,var(--color-admin-surface,#FFFFFF))] px-1.5 py-0.5 rounded ml-2">⌘K</span>
          </button>

          <button className="p-2 rounded-lg hover:bg-[var(--color-surface-muted,var(--color-admin-surface-hover,#F1F3F4))] text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>

          <button className="p-2 rounded-lg hover:bg-[var(--color-surface-muted,var(--color-admin-surface-hover,#F1F3F4))] text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-error,#D93025)]" />
          </button>

          <div className="relative pl-3 ml-1 border-l border-[var(--color-border,var(--color-admin-border,#DADCE0))]">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 rounded-lg p-1 hover:bg-[var(--color-surface-muted,var(--color-admin-surface-hover,#F1F3F4))] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--color-primary-surface,var(--color-admin-sidebar-active,#E8F0FE))] flex items-center justify-center text-[var(--color-primary,#1A73E8)] font-medium text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              {user?.name && (
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-[var(--color-text,var(--color-admin-text,#202124))] leading-tight">{user.name}</p>
                  {user?.role && <p className="text-xs text-[var(--color-text-secondary,var(--color-admin-text-muted,#80868B))]">{user.role}</p>}
                </div>
              )}
            </button>
             {userMenuOpen && (
               <>
                 <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)} />
                 <div className="absolute right-0 top-full mt-1 z-40 w-64 rounded-xl border border-[var(--color-border,var(--color-admin-border,#DADCE0))] bg-[var(--color-surface,var(--color-admin-surface,#FFFFFF))] shadow-lg p-2">
                   <div className="px-3 py-2 border-b border-[var(--color-border,var(--color-admin-border,#DADCE0))] mb-1">
                     <p className="text-sm font-medium text-[var(--color-text,var(--color-admin-text,#202124))]">{user?.name || "User"}</p>
                     <p className="text-xs text-[var(--color-text-secondary,var(--color-admin-text-muted,#80868B))] mt-0.5">{user?.email}</p>
                   </div>
                   {recentAccounts.length > 0 && (
                     <div className="mb-1">
                       <div className="px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary,var(--color-admin-text-muted,#80868B))] uppercase tracking-wider">Switch account</div>
                       {recentAccounts.map((account, idx) => (
                         <button key={idx} onClick={() => { setUserMenuOpen(false); onSwitchAccount?.(account); }}
                           className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] hover:bg-[var(--color-surface-muted,var(--color-admin-surface-hover,#F1F3F4))] hover:text-[var(--color-text,var(--color-admin-text,#202124))] transition-colors">
                           <div className="w-6 h-6 rounded-full bg-[var(--color-primary-surface,var(--color-admin-sidebar-active,#E8F0FE))] flex items-center justify-center text-[var(--color-primary,#1A73E8)] text-[10px] font-medium">
                             {(account.name || account.email || "U").charAt(0).toUpperCase()}
                           </div>
                           <div className="text-left">
                             <p className="text-sm font-medium">{account.name || account.email}</p>
                             {account.name && <p className="text-xs text-[var(--color-text-secondary,var(--color-admin-text-muted,#80868B))]">{account.email}</p>}
                           </div>
                         </button>
                       ))}
                     </div>
                   )}
                   {onLogout && (
                     <button onClick={onLogout}
                       className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--color-text-secondary,var(--color-admin-text-secondary,#5F6368))] hover:bg-[var(--color-surface-muted,var(--color-admin-surface-hover,#F1F3F4))] hover:text-[var(--color-text,var(--color-admin-text,#202124))] transition-colors"
                     >
                       Sign out
                     </button>
                   )}
                 </div>
               </>
             )}
          </div>
        </header>

        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 px-6 py-2 text-xs text-[var(--color-text-secondary,var(--color-admin-text-muted,#80868B))] border-b border-[var(--color-border,var(--color-admin-border,#DADCE0))]">
            {breadcrumbs.map((bc, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-[var(--color-text-secondary,var(--color-admin-text-muted,#80868B))]">/</span>}
                {bc.href ? (
                  <button onClick={() => onNavigate(bc.href!)} className="hover:text-[var(--color-text,var(--color-admin-text,#202124))] transition-colors">{bc.label}</button>
                ) : (
                  <span className="text-[var(--color-text,var(--color-admin-text,#202124))] font-medium">{bc.label}</span>
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
