import { cn } from '../../lib/utils';

export interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'suspended' | 'pending' | 'error' | 'success' | 'warning' | 'info' | string;
  size?: 'sm' | 'md';
  dot?: boolean;
  label?: string;
}

export function StatusBadge({ status, size = 'sm', dot = true, label }: StatusBadgeProps) {
  const colorMap: Record<string, string> = {
    active: 'var(--color-success)',
    inactive: 'var(--color-admin-text-muted)',
    suspended: 'var(--color-error)',
    pending: 'var(--color-warning)',
    error: 'var(--color-error)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
  };

  const surfaceMap: Record<string, string> = {
    active: 'var(--color-success-surface)',
    inactive: 'var(--color-admin-surface-hover)',
    suspended: 'var(--color-error-surface)',
    pending: 'var(--color-warning-surface)',
    error: 'var(--color-error-surface)',
    success: 'var(--color-success-surface)',
    warning: 'var(--color-warning-surface)',
    info: 'var(--color-info-surface)',
  };

  const color = colorMap[status] || 'var(--color-admin-text-muted)';
  const bg = surfaceMap[status] || 'var(--color-admin-surface-hover)';

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
    )} style={{ background: bg, color }}>
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />}
      {label || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
