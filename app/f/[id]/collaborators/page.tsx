'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn } from '../../../../lib/utils';
import {
  Users, UserPlus, X, Mail, Shield, Edit3,
  Eye, Crown, MoreHorizontal, Check, Trash2,
} from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: string;
}


const ROLE_OPTIONS = [
  { value: 'editor' as const, label: 'Editor', description: 'Can edit form and view responses', icon: Edit3 },
  { value: 'viewer' as const, label: 'Viewer', description: 'Can only view responses', icon: Eye },
];

const ROLE_BADGES: Record<string, { label: string; style: string }> = {
  owner: { label: 'Owner', style: 'bg-[var(--color-warning-surface)] text-[var(--color-warning)]' },
  editor: { label: 'Editor', style: 'bg-[var(--color-primary-surface)] text-[var(--color-primary)]' },
  viewer: { label: 'Viewer', style: 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]' },
};

export default function CollaboratorsPage() {
  const params = useParams();
  const id = params.id as string;
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState<'editor' | 'viewer'>('editor');
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  useEffect(() => {
    api.get<{ collaborators: Collaborator[] }>(`/api/forms/${id}/collaborators`)
      .then(d => { setCollaborators(d.collaborators || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const addCollaborator = async () => {
    const email = addEmail.trim();
    if (!email || adding) return;
    setAdding(true);
    setAddError('');
    const tempId = `new-${Date.now()}`;
    const optimistic: Collaborator = {
      id: tempId,
      name: email.split('@')[0],
      email,
      role: addRole,
      joinedAt: new Date().toISOString(),
    };
    setCollaborators(prev => [...prev, optimistic]);
    setAddEmail('');
    setShowAdd(false);
    try {
      const created = await api.post<Collaborator>(`/api/forms/${id}/collaborators`, { email, role: addRole });
      setCollaborators(prev => prev.map(c => c.id === tempId ? { ...created, joinedAt: new Date().toISOString() } : c));
    } catch (err: any) {
      setCollaborators(prev => prev.filter(c => c.id !== tempId));
      setShowAdd(true);
      setAddEmail(email);
      setAddError(err?.message || 'Could not add collaborator');
    } finally {
      setAdding(false);
    }
  };

  const removeCollaborator = async (collabId: string) => {
    const prev = collaborators;
    setCollaborators(prevList => prevList.filter(c => c.id !== collabId));
    try {
      await api.delete(`/api/forms/${id}/collaborators/${collabId}`);
    } catch {
      setCollaborators(prevList => {
        const target = prev.find(c => c.id === collabId);
        return target ? [...prevList, target] : prevList;
      });
    }
  };

  const changeRole = (collabId: string, role: 'editor' | 'viewer') => {
    setCollaborators(collaborators.map(c => c.id === collabId ? { ...c, role } : c));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text)]">Collaborators</h1>
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{collaborators.length} {collaborators.length === 1 ? 'person' : 'people'} have access</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
          <UserPlus className="w-4 h-4" />
          Add collaborator
        </button>
      </div>

      {showAdd && (
        <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Add collaborator</h2>
            <button onClick={() => setShowAdd(false)} className="p-1 rounded hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)]" />
              <input type="email" value={addEmail} onChange={e => { setAddEmail(e.target.value); setAddError(''); }} placeholder="Email address"
                className="w-full pl-9 pr-3 py-2 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-tertiary)]" />
            </div>
            <select value={addRole} onChange={e => setAddRole(e.target.value as any)}
              className="px-3 py-2 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]">
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <button onClick={addCollaborator} disabled={adding || !addEmail.trim()}
              className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50">
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
          {addError && (
            <p className="mb-3 text-xs text-[var(--color-error)]">{addError}</p>
          )}
          <p className="text-xs text-[var(--color-text-tertiary)]">
            They will receive an email invitation with access instructions.
          </p>
        </div>
      )}

      <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
        <div className="divide-y divide-[var(--color-border)]">
          {collaborators.map(collab => {
            const badge = ROLE_BADGES[collab.role] || ROLE_BADGES.viewer;
            return (
              <div key={collab.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0',
                    collab.role === 'owner'
                      ? 'bg-[var(--color-warning-surface)] text-[var(--color-warning)]'
                      : 'bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                  )}>
                    {collab.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-text)] truncate">{collab.name}</span>
                      {collab.role === 'owner' && <Crown className="w-3.5 h-3.5 text-[var(--color-warning)]" />}
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium', badge.style)}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-tertiary)]">{collab.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {collab.role !== 'owner' && (
                    <>
                      <select value={collab.role} onChange={e => changeRole(collab.id, e.target.value as any)}
                        className="px-2 py-1 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-xs text-[var(--color-text)] outline-none">
                        {ROLE_OPTIONS.map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                      <button onClick={() => removeCollaborator(collab.id)}
                        className="p-1.5 rounded-lg hover:bg-[var(--color-error-surface)] text-[var(--color-text-tertiary)] hover:text-[var(--color-error)] transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6  border-2 border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="text-sm font-semibold text-[var(--color-text)] mb-3">Permission roles</h2>
        <div className="space-y-3">
          {[
            { role: 'Owner', icon: Crown, description: 'Full access. Can manage collaborators, settings, and delete the form.', color: 'text-[var(--color-warning)]' },
            { role: 'Editor', icon: Edit3, description: 'Can edit form fields, view and export responses, and view analytics.', color: 'text-[var(--color-primary)]' },
            { role: 'Viewer', icon: Eye, description: 'Can view responses and analytics only. Cannot edit the form.', color: 'text-[var(--color-text-secondary)]' },
          ].map(p => (
            <div key={p.role} className="flex items-start gap-3">
              <p.icon className={cn('w-4 h-4 mt-0.5', p.color)} />
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{p.role}</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
