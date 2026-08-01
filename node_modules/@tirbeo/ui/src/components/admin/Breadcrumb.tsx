'use client';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (href: string) => void;
}

export function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-[var(--color-admin-text-muted)]">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span className="text-[var(--color-admin-text-muted)]">/</span>}
          {item.href ? (
            <button onClick={() => onNavigate(item.href!)}
              className="hover:text-[var(--color-admin-text)] transition-colors">
              {item.label}
            </button>
          ) : (
            <span className="text-[var(--color-admin-text-secondary)]">{item.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}
