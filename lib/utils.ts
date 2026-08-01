export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'published': return 'text-[var(--color-success)]';
    case 'draft': return 'text-[var(--color-text-secondary)]';
    case 'archived': return 'text-[var(--color-text-tertiary)]';
    case 'closed': return 'text-[var(--color-error)]';
    default: return 'text-[var(--color-text-secondary)]';
  }
}

export function getStatusBadgeStyle(status: string): string {
  switch (status) {
    case 'published': return 'bg-[var(--color-success-surface)] text-[var(--color-success)]';
    case 'draft': return 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]';
    case 'archived': return 'bg-[var(--color-surface-muted)] text-[var(--color-text-tertiary)]';
    case 'closed': return 'bg-[var(--color-error-surface)] text-[var(--color-error)]';
    default: return 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]';
  }
}
