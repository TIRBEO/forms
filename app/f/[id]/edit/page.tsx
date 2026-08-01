'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn } from '../../../../lib/utils';
import {
  Plus, GripVertical, Type, AlignLeft, List, ListOrdered,
  CheckSquare, Circle, ChevronDown, Calendar, Upload,
  Hash, Star, ToggleLeft, Save, Eye, ArrowLeft, Trash2,
  Copy, Edit3, Image,
} from 'lucide-react';

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  order: number;
  placeholder?: string;
  description?: string;
}

const FIELD_TYPES = [
  { type: 'text', label: 'Short Text', icon: Type },
  { type: 'textarea', label: 'Long Text', icon: AlignLeft },
  { type: 'email', label: 'Email', icon: Type },
  { type: 'phone', label: 'Phone', icon: Hash },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'time', label: 'Time', icon: Calendar },
  { type: 'select', label: 'Dropdown', icon: ChevronDown },
  { type: 'radio', label: 'Multiple Choice', icon: Circle },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
  { type: 'rating', label: 'Rating', icon: Star },
  { type: 'file', label: 'File Upload', icon: Upload },
  { type: 'toggle', label: 'Toggle', icon: ToggleLeft },
] as const;

const FIELD_ICONS: Record<string, any> = {
  text: Type, textarea: AlignLeft, email: Type, phone: Hash,
  number: Hash, date: Calendar, time: Calendar,
  select: ChevronDown, radio: Circle, checkbox: CheckSquare,
  rating: Star, file: Upload, toggle: ToggleLeft,
};

export default function FormEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [title, setTitle] = useState('Untitled Form');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingField, setAddingField] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    api.get<any>(`/api/forms/${id}`).then(d => {
      setTitle(d.title || 'Untitled Form');
      setDescription(d.description || '');
      setFields(d.fields || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const addField = (type: string) => {
    const newField: FormField = {
      id: `new-${Date.now()}`,
      type,
      label: `New ${type} field`,
      required: false,
      order: fields.length,
    };
    setFields([...fields, newField]);
    setAddingField(false);
    setSelectedField(newField.id);
  };

  const saveForm = async () => {
    setSaving(true);
    try {
      await api.put(`/api/forms/${id}`, { title, description, fields });
    } catch {}
    setTimeout(() => setSaving(false), 500);
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
        <h1 className="text-lg font-semibold text-[var(--color-text)]">Edit Form</h1>
        <div className="flex items-center gap-2">
          {saving ? (
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <div className="animate-spin w-3 h-3 border border-[var(--color-primary)] border-t-transparent rounded-full" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-success)]">
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
              Saved
            </span>
          )}
          <button onClick={saveForm}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-6">
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          className="w-full text-2xl font-semibold text-[var(--color-text)] bg-transparent border-none outline-none placeholder:text-[var(--color-text-tertiary)]"
          placeholder="Form title" />
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          className="w-full mt-3 text-sm text-[var(--color-text-secondary)] bg-transparent border-none outline-none resize-none placeholder:text-[var(--color-text-tertiary)]"
          placeholder="Form description..." rows={2} />
      </div>

      <div className="space-y-3 mb-6">
        {fields.map((field, idx) => {
          const Icon = FIELD_ICONS[field.type] || Type;
          const isSelected = selectedField === field.id;
          return (
            <div key={field.id}
              className={cn(
                'rounded-xl border bg-[var(--color-surface)] transition-all',
                isSelected ? 'border-[var(--color-primary)] shadow-sm' : 'border-[var(--color-border)]'
              )}>
              <div className="flex items-center gap-3 p-4" onClick={() => setSelectedField(field.id)}>
                <div className="cursor-grab text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-sm font-medium text-[var(--color-text)]">{field.label}</span>
                    {field.required && (
                      <span className="text-xs text-[var(--color-error)]">*</span>
                    )}
                  </div>
                  {field.placeholder && (
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{field.placeholder}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[var(--color-text-tertiary)] bg-[var(--color-surface-muted)] px-2 py-0.5 rounded">{field.type}</span>
                  <button className="p-1 rounded hover:bg-[var(--color-surface-muted)] text-[var(--color-text-tertiary)]">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded hover:bg-[var(--color-error-surface)] text-[var(--color-text-tertiary)] hover:text-[var(--color-error)]">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative">
        {addingField ? (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-[var(--color-text)]">Add field</span>
              <button onClick={() => setAddingField(false)} className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">Cancel</button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {FIELD_TYPES.map(ft => (
                <button key={ft.type} onClick={() => addField(ft.type)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all text-center">
                  <ft.icon className="w-5 h-5 text-[var(--color-primary)]" />
                  <span className="text-[10px] leading-tight text-[var(--color-text-secondary)]">{ft.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingField(true)}
            className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add field
          </button>
        )}
      </div>
    </div>
  );
}
