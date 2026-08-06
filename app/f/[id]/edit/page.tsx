'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api-client';
import { cn } from '../../../../lib/utils';
import {
  ArrowLeft, Type, AlignLeft, List, CheckSquare, Circle,
  ChevronDown, Calendar, Upload, Hash, Star, ToggleLeft,
  Copy, Trash2, Eye, Send, Check, X, Plus, Palette,
  ChevronUp, Smartphone, Monitor, Link2, GripVertical,
  Share2, Sparkles, HelpCircle, Download, FileJson,
} from 'lucide-react';
import { LivePreview } from '../../../components/live-preview';
import type { FormFieldData, FormFieldOption } from '../../../components/field-input';
import {
  FORM_THEMES, DEFAULT_THEME_CONFIG, getBackgroundOptions, FONT_OPTIONS,
  type ThemeConfig, themeFromPreset, themeFromStorage, themePageStyle, themeCardStyle, themeButtonStyle,
} from '../../../../lib/templates/themes';

const FIELD_TYPES: { type: string; label: string; icon: any }[] = [
  { type: 'text', label: 'Short answer', icon: Type },
  { type: 'textarea', label: 'Paragraph', icon: AlignLeft },
  { type: 'email', label: 'Email', icon: Type },
  { type: 'phone', label: 'Phone', icon: Hash },
  { type: 'number', label: 'Number', icon: Hash },
  { type: 'date', label: 'Date', icon: Calendar },
  { type: 'time', label: 'Time', icon: Calendar },
  { type: 'select', label: 'Dropdown', icon: ChevronDown },
  { type: 'radio', label: 'Multiple choice', icon: Circle },
  { type: 'checkbox', label: 'Checkboxes', icon: CheckSquare },
  { type: 'rating', label: 'Rating', icon: Star },
  { type: 'file', label: 'File upload', icon: Upload },
  { type: 'toggle', label: 'Toggle', icon: ToggleLeft },
];

const CHOICE_TYPES = new Set(['select', 'radio', 'checkbox']);
const TEXT_TYPES = new Set(['text', 'textarea', 'email', 'phone', 'number', 'date', 'time']);

const FIELD_ICON: Record<string, any> = Object.fromEntries(FIELD_TYPES.map(ft => [ft.type, ft.icon]));

const COLORS = [
  '#ffd93d', '#17150f', '#4d96ff', '#ff6b9d', '#4ade80', '#ffa000', '#9b5de5', '#e5484d', '#2563EB', '#f6f3ea',
];

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function newField(type: string, order: number): FormFieldData {
  const label = 'Untitled question';
  const options: FormFieldOption[] | undefined = CHOICE_TYPES.has(type)
    ? [{ value: `option-${newId()}`, label: 'Option 1' }, { value: `option-${newId()}`, label: 'Option 2' }]
    : undefined;
  return { id: newId(), type, label, required: false, order, options };
}

function stripOptionMeta(fields: FormFieldData[]) {
  return fields.map(f => ({
    id: f.id,
    type: f.type,
    label: f.label,
    required: f.required,
    order: f.order,
    placeholder: f.placeholder,
    description: f.description,
    ...(f.options?.length ? { options: f.options.map(o => ({ label: o.label, value: o.value })) } : {}),
  }));
}

interface FormMeta {
  id: string;
  title: string;
  description?: string;
  status: string;
  publicId: string;
  fields: FormFieldData[];
}

export default function FormEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [meta, setMeta] = useState<FormMeta | null>(null);
  const [fields, setFields] = useState<FormFieldData[]>([]);
  const [color, setColor] = useState('#ffd93d');
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME_CONFIG);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [bannerImage, setBannerImage] = useState('');
  const [logoImage, setLogoImage] = useState('');
  const [source, setSource] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [saveState, setSaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle');
  const [shareOpen, setShareOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [showDescToggle, setShowDescToggle] = useState<Record<string, boolean>>({});

  const lastSavedRef = useRef<string>('');
  const lastFieldsRef = useRef<string>('');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get<FormMeta>(`/api/forms/${id}`),
      api.get<any>(`/api/forms/${id}/settings`),
    ]).then(([form, settings]) => {
      if (cancelled) return;
      setMeta(form);
      setFields(form.fields || []);
      setColor(settings?.color || '#ffd93d');
      setTheme(themeFromStorage(settings?.theme));
      setBannerImage(settings?.bannerImage || '');
      setLogoImage(settings?.logoImage || '');
      setSource(settings?.source === 'admin' ? 'admin' : 'user');
      if (typeof settings?.showProgressBar === 'boolean') setShowProgressBar(settings.showProgressBar);
      setLoading(false);
      hydratedRef.current = true;
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  const doSave = useCallback(async () => {
    if (!meta || !hydratedRef.current) return;
    setSaveState('saving');
    try {
      const current = JSON.stringify({ title: meta.title, description: meta.description, fields, color, showProgressBar, theme });
      const payload: any = {
        title: meta.title,
        description: meta.description || '',
        color,
        showProgressBar,
        theme,
      };
      if (JSON.stringify(fields) !== lastFieldsRef.current) {
        payload.fields = stripOptionMeta(fields);
      }
      await api.put(`/api/forms/${id}/settings`, payload);
      lastSavedRef.current = current;
      lastFieldsRef.current = JSON.stringify(fields);
      setSaveState(current === JSON.stringify({ title: meta.title, description: meta.description, fields, color, showProgressBar, theme }) ? 'saved' : 'dirty');
    } catch {
      setSaveState('error');
    }
  }, [meta, fields, color, showProgressBar, theme, id]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (meta && JSON.stringify({ title: meta.title, description: meta.description, fields, color, showProgressBar, theme }) === lastSavedRef.current) {
      setSaveState('saved');
      return;
    }
    setSaveState('dirty');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => doSave(), 900);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [meta, fields, color, showProgressBar, theme, doSave]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        doSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doSave]);

  const addField = (type: string) => {
    const order = fields.length;
    const f = newField(type, order);
    setFields(prev => [...prev, f]);
    setSelectedId(f.id);
    setShowPalette(false);
    setTimeout(() => document.getElementById(`field-${f.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const updateField = (fieldId: string, patch: Partial<FormFieldData>) => {
    setFields(prev => prev.map(f => (f.id === fieldId ? { ...f, ...patch } : f)));
  };

  const changeType = (fieldId: string, type: string) => {
    setFields(prev => prev.map(f => {
      if (f.id !== fieldId) return f;
      const next: FormFieldData = { ...f, type };
      if (CHOICE_TYPES.has(type) && (!f.options || !f.options.length)) {
        next.options = [
          { value: `option-${newId()}`, label: 'Option 1' },
          { value: `option-${newId()}`, label: 'Option 2' },
        ];
      }
      return next;
    }));
  };

  const updateOption = (fieldId: string, optionValue: string, label: string) => {
    setFields(prev => prev.map(f => {
      if (f.id !== fieldId) return f;
      return {
        ...f,
        options: (f.options || []).map(o => (o.value === optionValue ? { ...o, label } : o)),
      };
    }));
  };

  const addOption = (fieldId: string) => {
    setFields(prev => prev.map(f => {
      if (f.id !== fieldId) return f;
      return { ...f, options: [...(f.options || []), { value: `option-${newId()}`, label: `Option ${(f.options?.length || 0) + 1}` }] };
    }));
  };

  const removeOption = (fieldId: string, optionValue: string) => {
    setFields(prev => prev.map(f => {
      if (f.id !== fieldId) return f;
      return { ...f, options: (f.options || []).filter(o => o.value !== optionValue) };
    }));
  };

  const duplicateField = (fieldId: string) => {
    const idx = fields.findIndex(f => f.id === fieldId);
    if (idx === -1) return;
    const src = fields[idx];
    const copy: FormFieldData = {
      ...src,
      id: newId(),
      order: idx + 1,
      label: `${src.label} (copy)`,
      options: src.options?.map(o => ({ value: `option-${newId()}`, label: o.label })),
    };
    const next = [...fields];
    next.splice(idx + 1, 0, copy);
    next.forEach((f, i) => (f.order = i));
    setFields(next);
    setSelectedId(copy.id);
  };

  const removeField = (fieldId: string) => {
    setFields(prev => {
      const next = prev.filter(f => f.id !== fieldId);
      next.forEach((f, i) => (f.order = i));
      return next;
    });
    if (selectedId === fieldId) setSelectedId(null);
  };

  const moveField = (fieldId: string, dir: -1 | 1) => {
    setFields(prev => {
      const idx = prev.findIndex(f => f.id === fieldId);
      const target = idx + dir;
      if (idx === -1 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      next.forEach((f, i) => (f.order = i));
      return next;
    });
  };

  const publish = async () => {
    if (!meta) return;
    try {
      if (meta.status !== 'published') {
        await api.post(`/api/forms/${id}/publish`);
        setMeta({ ...meta, status: 'published' });
      }
      setShareOpen(true);
    } catch {}
  };

  const handleExportJson = () => {
    if (!meta) return;
    // Clean theme export: structure + theme only — no ids, no domain, no internal settings.
    const payload = { title: meta.title, description: meta.description || '', theme, fields: stripOptionMeta(fields) };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/^-+|-+$/g, '') || 'form'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importText);
      if (typeof parsed !== 'object' || parsed === null || !Array.isArray(parsed.fields)) {
        throw new Error('JSON must be an object with a "fields" array');
      }
      const title = typeof parsed.title === 'string' && parsed.title.trim() ? parsed.title.trim() : meta?.title || 'Untitled form';
      const description = typeof parsed.description === 'string' ? parsed.description : (meta?.description || '');
      const next: FormFieldData[] = parsed.fields.map((f: any, i: number) => ({
        id: typeof f?.id === 'string' && f.id ? f.id : newId(),
        type: FIELD_TYPES.some(t => t.type === f?.type) ? f.type : 'text',
        label: String(f?.label || 'Untitled question'),
        required: Boolean(f?.required),
        order: i,
        placeholder: typeof f?.placeholder === 'string' ? f.placeholder : undefined,
        description: typeof f?.description === 'string' ? f.description : undefined,
        options: Array.isArray(f?.options)
          ? f.options.map((o: any) => ({
              value: typeof o?.value === 'string' && o.value ? o.value : `option-${newId()}`,
              label: String(o?.label || 'Option'),
            }))
          : undefined,
      }));
      if (meta) setMeta({ ...meta, title, description });
      setFields(next);
      if (parsed.theme && typeof parsed.theme === 'object') {
        setTheme(themeFromStorage(parsed.theme));
        setColor(themeFromStorage(parsed.theme).primaryColor || color);
      }
      setImportOpen(false);
      setImportError('');
    } catch (e: any) {
      setImportError(e?.message || 'Invalid JSON');
    }
  };

  const addOtherOption = (fieldId: string) => {
    setFields(prev => prev.map(f => {
      if (f.id !== fieldId) return f;
      if (f.options?.some(o => /^other$/i.test(o.label))) return f;
      return { ...f, options: [...(f.options || []), { value: '__other__', label: 'Other' }] };
    }));
  };

  const publicUrl = meta ? `${window.location.origin}/${source === 'admin' ? 'a' : 'f'}/${meta.publicId}` : '';
  const fillPath = meta ? `/${source === 'admin' ? 'a' : 'f'}/${meta.publicId}` : '';

  const patchTheme = (patch: Partial<ThemeConfig>) => setTheme(prev => ({ ...prev, ...patch }));

  const applyPreset = (id: string) => {
    const preset = FORM_THEMES.find(t => t.id === id);
    if (!preset) return;
    const next = themeFromPreset(preset);
    setTheme(next);
    setColor(next.primaryColor);
  };

  const renderFieldCard = (field: FormFieldData) => {
    const isSelected = selectedId === field.id;
    const Icon = FIELD_ICON[field.type] || Type;
    const isChoice = CHOICE_TYPES.has(field.type);
    const showDesc = showDescToggle[field.id] || Boolean(field.description);

    return (
      <div
        id={`field-${field.id}`}
        onClick={() => setSelectedId(field.id)}
        className={cn(
          ' border-2 bg-[var(--color-surface)] transition-all cursor-pointer',
          isSelected
            ? 'border-[var(--color-primary)] shadow-brutal-sm border-l-8'
            : 'border-[var(--color-border)] hover:border-[var(--color-primary-border)]'
        )}
        style={{ borderLeftColor: isSelected ? 'var(--color-primary)' : undefined }}>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Icon className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
            <select
              value={field.type}
              onChange={e => { e.stopPropagation(); changeType(field.id, e.target.value); }}
              className="px-2 py-1 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-xs font-medium text-[var(--color-text-secondary)] outline-none cursor-pointer">
              {FIELD_TYPES.map(ft => (
                <option key={ft.type} value={ft.type}>{ft.label}</option>
              ))}
            </select>
            <div className="flex-1" />
            <button onClick={e => { e.stopPropagation(); moveField(field.id, -1); }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-text-tertiary)]">
              <ChevronUp className="w-4 h-4" />
            </button>
            <button onClick={e => { e.stopPropagation(); moveField(field.id, 1); }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-text-tertiary)]">
              <ChevronDown className="w-4 h-4" />
            </button>
            <button onClick={e => { e.stopPropagation(); duplicateField(field.id); }} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-text-tertiary)]" title="Duplicate">
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={e => { e.stopPropagation(); removeField(field.id); }} className="p-1.5 rounded-lg hover:bg-[var(--color-error-surface)] text-[var(--color-text-tertiary)] hover:text-[var(--color-error)]" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <input
            type="text"
            value={field.label}
            placeholder="Untitled question"
            onChange={e => updateField(field.id, { label: e.target.value })}
            onClick={e => e.stopPropagation()}
            className="w-full px-3 py-2 rounded-lg border border-transparent hover:border-[var(--color-border)] focus:border-[var(--color-primary)] bg-transparent text-base font-medium text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)] transition-colors" />

          {showDesc && (
            <input
              type="text"
              value={field.description || ''}
              placeholder="Description (optional)"
              onChange={e => updateField(field.id, { description: e.target.value })}
              onClick={e => e.stopPropagation()}
              className="mt-1 w-full px-3 py-2 rounded-lg border border-transparent hover:border-[var(--color-border)] focus:border-[var(--color-primary)] bg-transparent text-sm text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-tertiary)] transition-colors" />
          )}

          {isChoice && (
            <div className="mt-2 space-y-2 pl-2">
              {field.options?.map(o => (
                <div key={o.value} className="flex items-center gap-2">
                  {field.type === 'checkbox'
                    ? <span className="w-4 h-4 border-2 border-[var(--color-border)] rounded" />
                    : field.type === 'select'
                      ? <ChevronDown className="w-4 h-4 text-[var(--color-text-tertiary)]" />
                      : <span className="w-4 h-4 border-2 border-[var(--color-border)] rounded-full" />}
                  <input
                    type="text"
                    value={o.label}
                    onChange={e => updateOption(field.id, o.value, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="flex-1 px-3 py-2 rounded-lg border border-transparent hover:border-[var(--color-border)] focus:border-[var(--color-primary)] bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)] transition-colors" />
                  <button onClick={e => { e.stopPropagation(); removeOption(field.id, o.value); }}
                    className="p-1 rounded-lg hover:bg-[var(--color-error-surface)] text-[var(--color-text-tertiary)] hover:text-[var(--color-error)]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button onClick={e => { e.stopPropagation(); addOption(field.id); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add option
              </button>
              {!field.options?.some(o => /^other$/i.test(o.label)) && (
                <button onClick={e => { e.stopPropagation(); addOtherOption(field.id); }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Add "Other"
                </button>
              )}
            </div>
          )}

          {TEXT_TYPES.has(field.type) && field.type !== 'email' && field.type !== 'phone' && (
            <input
              type="text"
              value={field.placeholder || ''}
              placeholder="Placeholder text"
              onChange={e => updateField(field.id, { placeholder: e.target.value })}
              onClick={e => e.stopPropagation()}
              className="mt-2 w-full px-3 py-2 rounded-lg border border-transparent hover:border-[var(--color-border)] focus:border-[var(--color-primary)] bg-transparent text-sm text-[var(--color-text-secondary)] outline-none placeholder:text-[var(--color-text-tertiary)] transition-colors" />
          )}

          <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
            <button onClick={e => { e.stopPropagation(); setShowDescToggle(prev => ({ ...prev, [field.id]: !prev[field.id] })); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
              {showDesc ? 'Hide' : 'Add'} description
            </button>
            <label className="flex items-center gap-2 cursor-pointer" onClick={e => e.stopPropagation()}>
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">Required</span>
              <button onClick={() => updateField(field.id, { required: !field.required })}
                className={cn(
                  'relative w-9 h-5 rounded-full transition-colors',
                  field.required ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-muted)]'
                )}>
                <div className={cn(
                  'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[var(--color-bg)] shadow-[var(--shadow-card)] transition-transform',
                  field.required && 'translate-x-4'
                )} />
              </button>
            </label>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-[var(--color-text-tertiary)]" />
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Form not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[var(--color-bg-surface)] border-b-2 border-[var(--color-border)]">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.push(`/f/${id}`)}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={meta.title}
            onChange={e => setMeta({ ...meta, title: e.target.value })}
            placeholder="Untitled form"
            className="flex-1 min-w-0 px-2 py-1.5 rounded-lg bg-transparent text-lg font-semibold text-[var(--color-text)] outline-none border border-transparent focus:border-[var(--color-border)] placeholder:text-[var(--color-text-tertiary)]" />

          <span className={cn(
            'inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap',
            saveState === 'saving' && 'text-[var(--color-text-secondary)]',
            saveState === 'saved' && 'text-[var(--color-success)]',
            saveState === 'error' && 'text-[var(--color-error)]',
            saveState === 'dirty' && 'text-[var(--color-text-secondary)]'
          )}>
            {saveState === 'saving' && (<><div className="animate-spin w-3 h-3 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />Saving...</>)}
            {saveState === 'saved' && (<><Check className="w-3.5 h-3.5" />All changes saved</>)}
            {saveState === 'dirty' && 'Unsaved changes...'}
            {saveState === 'error' && 'Save failed — click Save'}
            {saveState === 'idle' && ''}
          </span>

          <div className="flex items-center gap-2">
            <button onClick={handleExportJson} title="Export form structure as JSON"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
              <Download className="w-4 h-4" />
              <span className="hidden xl:inline">Export JSON</span>
            </button>
            <button onClick={() => { setImportText(''); setImportError(''); setImportOpen(true); }} title="Build form from JSON"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
              <FileJson className="w-4 h-4" />
              <span className="hidden xl:inline">Import JSON</span>
            </button>
            <button onClick={() => setPreviewOpen(!previewOpen)}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-colors',
                previewOpen
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                  : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]'
              )}>
              <Eye className="w-4 h-4" />
              Preview
            </button>

            {meta.status === 'published' ? (
              <>
                <button onClick={() => { setShareOpen(true); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">
                  <Link2 className="w-4 h-4" />
                  Share
                </button>
                <button onClick={() => window.open(fillPath, '_blank')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
                  <Send className="w-4 h-4" />
                  View live
                </button>
              </>
            ) : (
              <button onClick={publish}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
                <Send className="w-4 h-4" />
                Publish
              </button>
            )}
          </div>
        </div>
      </header>

      {importOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setImportOpen(false)}>
          <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-brutal max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-[var(--color-text)]">Import form from JSON</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">Paste an exported form structure — fields will replace the current ones.</p>
              </div>
              <button onClick={() => setImportOpen(false)} className="p-1 rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={importText}
              onChange={e => { setImportText(e.target.value); setImportError(''); }}
              placeholder='{"title":"My form","description":"","fields":[{"label":"Name","type":"text","required":true},{"label":"Email","type":"email"}]}'
              rows={8}
              className="w-full px-3 py-2 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-mono text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] resize-y placeholder:text-[var(--color-text-tertiary)]"
            />
            {importError && <p className="mt-2 text-xs text-[var(--color-error)]">{importError}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setImportOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] transition-colors">Cancel</button>
              <button onClick={handleImportJson} disabled={!importText.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50">
                <FileJson className="w-4 h-4" />
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      {shareOpen && meta && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShareOpen(false)}>
          <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-brutal max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[var(--color-text)]">Share form</h3>
              <button onClick={() => setShareOpen(false)} className="p-1 rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">Anyone with the link can submit a response.</p>
            <div className="flex items-center gap-2 p-2 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)]">
              <Link2 className="w-4 h-4 text-[var(--color-text-tertiary)] shrink-0 ml-1" />
              <input readOnly value={publicUrl} onFocus={e => e.target.select()}
                className="flex-1 min-w-0 bg-transparent text-sm text-[var(--color-text)] outline-none" />
              <button onClick={() => { navigator.clipboard.writeText(publicUrl); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-xs font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
                <Copy className="w-3.5 h-3.5" />
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Left palette */}
        <aside className="w-16 lg:w-60 flex-shrink-0 border-r-2 border-[var(--color-border)] bg-[var(--color-bg-surface)] sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <div className="p-3">
            <button onClick={() => setShowPalette(!showPalette)}
              className="w-full flex items-center justify-center lg:justify-start gap-2 px-3 py-2.5 rounded-lg bg-[var(--color-primary)] text-[var(--color-bg)] text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
              <Plus className="w-4 h-4" />
              <span className="hidden lg:inline">Add question</span>
            </button>

            <div className={cn('mt-3 space-y-1', !showPalette && 'hidden lg:block')}>
              {FIELD_TYPES.map(ft => {
                const Icon = ft.icon;
                return (
                  <button key={ft.type} onClick={() => addField(ft.type)} title={ft.label}
                    className="w-full flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text)] transition-colors">
                    <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="hidden lg:inline">{ft.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-2 p-3 border-t-2 border-[var(--color-border)]">
            <p className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
              <Palette className="w-3.5 h-3.5" />
              Accent color
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
              {COLORS.map(c => (
                <button key={c} onClick={() => { setColor(c); patchTheme({ primaryColor: c, accentColor: c }); }} title={c}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 transition-transform',
                    color === c ? 'border-[var(--color-primary)] scale-110' : 'border-[var(--color-border)] hover:scale-105'
                  )}
                  style={{ backgroundColor: c }} />
              ))}
            </div>

            {/* Theme templates */}
            <div className="mt-5">
              <p className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Templates
              </p>
              <div className="grid grid-cols-4 lg:grid-cols-2 gap-2 justify-items-center lg:justify-items-stretch">
                {FORM_THEMES.map(t => (
                  <button key={t.id} onClick={() => applyPreset(t.id)} title={t.description}
                    className={cn(
                      'w-full text-left rounded-lg border-2 p-2 transition-all',
                      theme.themeId === t.id ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                    )}>
                    <span className="block h-9 rounded-md border-2 border-[var(--color-border)]" style={{ background: t.colors.background.startsWith('linear-gradient') ? t.colors.surface : t.colors.background }} />
                    <span className="mt-1.5 block text-[11px] font-medium text-[var(--color-text)] truncate">{t.preview} {t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mini theme preview */}
            <div className="mt-5">
              <p className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
                <Eye className="w-3.5 h-3.5" />
                Theme preview
              </p>
              <div className="rounded-lg border-2 border-[var(--color-border)] p-2" style={themePageStyle(theme)}>
                <div className="rounded-md p-2.5" style={themeCardStyle(theme)}>
                  {theme.headerImageUrl && (
                    <div className="mb-2 rounded-md overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={theme.headerImageUrl} alt="" className="w-full h-14 object-cover" />
                    </div>
                  )}
                  <p className="text-xs font-semibold" style={{ fontFamily: theme.headingFont, color: theme.textColor }}>Sample question?</p>
                  <p className="text-[10px] mt-0.5" style={{ color: theme.textMutedColor }}>A short description goes here</p>
                  <div className="mt-2 h-6 rounded" style={themeButtonStyle(theme)} />
                </div>
              </div>
            </div>

            {/* Background */}
            <div className="mt-5">
              <p className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
                <Palette className="w-3.5 h-3.5" />
                Background
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                {getBackgroundOptions().map(b => (
                  <button key={b.id} onClick={() => patchTheme({ backgroundColor: b.value })}
                    title={b.label}
                    className={cn(
                      'w-6 h-6 rounded-full border-2 transition-transform',
                      theme.backgroundColor === b.value ? 'border-[var(--color-primary)] scale-110' : 'border-[var(--color-border)] hover:scale-105'
                    )}
                    style={{ background: b.swatch }} />
                ))}
              </div>
              <input type="text" value={theme.backgroundColor} onChange={e => patchTheme({ backgroundColor: e.target.value })}
                placeholder="#fff or linear-gradient(...)"
                className="mt-2 w-full px-2 py-1 rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-[11px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-tertiary)]" />
            </div>

            {/* Custom colors */}
            <div className="mt-5">
              <p className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
                <Palette className="w-3.5 h-3.5" />
                Colors
              </p>
              <div className="space-y-2">
                {([
                  ['Accent', 'primaryColor'],
                  ['Surface', 'surfaceColor'],
                  ['Text', 'textColor'],
                  ['Muted', 'textMutedColor'],
                  ['Border', 'borderColor'],
                ] as const).map(([label, key]) => (
                  <label key={key} className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[var(--color-text-secondary)]">{label}</span>
                    <input type="color" value={theme[key]} onChange={e => patchTheme({ [key]: e.target.value } as any)}
                      className="w-7 h-6 rounded border-2 border-[var(--color-border)] bg-transparent cursor-pointer" />
                  </label>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="mt-5 space-y-2">
              <p className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
                <Sparkles className="w-3.5 h-3.5" />
                Style
              </p>
              <label className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[var(--color-text-secondary)]">Corners</span>
                <select value={theme.borderRadius} onChange={e => patchTheme({ borderRadius: e.target.value })}
                  className="px-1.5 py-1 rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-[11px] text-[var(--color-text)] outline-none">
                  {['4px', '8px', '12px', '16px', '24px', '9999px'].map(v => <option key={v} value={v}>{v === '9999px' ? 'Pill' : v}</option>)}
                </select>
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[var(--color-text-secondary)]">Padding</span>
                <select value={theme.padding} onChange={e => patchTheme({ padding: e.target.value })}
                  className="px-1.5 py-1 rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-[11px] text-[var(--color-text)] outline-none">
                  {['24px', '32px', '40px', '48px'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[var(--color-text-secondary)]">Button</span>
                <select value={theme.buttonStyle} onChange={e => patchTheme({ buttonStyle: e.target.value as any })}
                  className="px-1.5 py-1 rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-[11px] text-[var(--color-text)] outline-none">
                  <option value="rounded">Rounded</option>
                  <option value="pill">Pill</option>
                  <option value="square">Square</option>
                  <option value="outline">Outline</option>
                </select>
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[var(--color-text-secondary)]">Font</span>
                <select value={theme.headingFont} onChange={e => patchTheme({ headingFont: e.target.value, bodyFont: e.target.value })}
                  className="px-1.5 py-1 rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-[11px] text-[var(--color-text)] outline-none">
                  {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </label>
              <label className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-[var(--color-text-secondary)]">Width</span>
                <select value={theme.maxWidth} onChange={e => patchTheme({ maxWidth: e.target.value })}
                  className="px-1.5 py-1 rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-[11px] text-[var(--color-text)] outline-none">
                  {['560px', '640px', '720px'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </label>
            </div>

            {/* Images */}
            <div className="mt-5 space-y-2">
              <p className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-secondary)]">
                <Upload className="w-3.5 h-3.5" />
                Images
              </p>
              <div>
                <span className="text-[11px] text-[var(--color-text-secondary)]">Header image URL</span>
                <input type="url" value={theme.headerImageUrl} onChange={e => patchTheme({ headerImageUrl: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 w-full px-2 py-1 rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-[11px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-tertiary)]" />
              </div>
              <div>
                <span className="text-[11px] text-[var(--color-text-secondary)]">Logo image URL</span>
                <input type="url" value={logoImage} onChange={e => setLogoImage(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full px-2 py-1 rounded-md border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-[11px] text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] placeholder:text-[var(--color-text-tertiary)]" />
              </div>
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex-1 min-w-0">
          <div className="max-w-2xl mx-auto py-6 px-4">
            <div className="border-2 border-[var(--color-border)] bg-[var(--color-surface)] shadow-brutal-sm overflow-hidden mb-5">
              <div className="p-6" style={{ borderTop: `6px solid ${color}` }}>
                <input type="text" value={meta.title} onChange={e => setMeta({ ...meta, title: e.target.value })}
                  placeholder="Untitled form"
                  className="w-full bg-transparent text-2xl font-semibold text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)]" />
                <textarea value={meta.description || ''} onChange={e => setMeta({ ...meta, description: e.target.value })}
                  placeholder="Form description"
                  rows={2}
                  className="w-full mt-2 bg-transparent text-sm text-[var(--color-text-secondary)] outline-none resize-none placeholder:text-[var(--color-text-tertiary)]" />
              </div>
            </div>

            <div className="space-y-4">
              {fields.map(field => renderFieldCard(field))}
            </div>

            {fields.length === 0 && (
              <div className="border-2 border-dashed border-[var(--color-border)] p-10 text-center">
                <Sparkles className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-tertiary)]" />
                <h3 className="text-base font-medium text-[var(--color-text)] mb-1">No questions yet</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-5">Add a question to get started</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {FIELD_TYPES.slice(0, 6).map(ft => {
                    const Icon = ft.icon;
                    return (
                      <button key={ft.type} onClick={() => addField(ft.type)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-[var(--color-border)] text-xs font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                        {ft.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button onClick={() => addField('text')}
              className="mt-5 w-full py-3  border-2 border-dashed border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add question
            </button>
          </div>
        </div>

        {/* Live preview pane */}
        {previewOpen && (
          <aside className="w-[420px] flex-shrink-0 border-l-2 border-[var(--color-border)] bg-[var(--color-bg)] hidden lg:flex flex-col">
            <div className="flex items-center justify-between px-4 h-12 border-b-2 border-[var(--color-border)] bg-[var(--color-bg-surface)]">
              <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Live preview</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPreviewDevice('desktop')}
                  className={cn('p-1.5 rounded-lg transition-colors', previewDevice === 'desktop' ? 'bg-[var(--color-primary-surface)] text-[var(--color-primary)]' : 'text-[var(--color-text-tertiary)]')}>
                  <Monitor className="w-4 h-4" />
                </button>
                <button onClick={() => setPreviewDevice('mobile')}
                  className={cn('p-1.5 rounded-lg transition-colors', previewDevice === 'mobile' ? 'bg-[var(--color-primary-surface)] text-[var(--color-primary)]' : 'text-[var(--color-text-tertiary)]')}>
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 min-h-0 bg-[var(--color-bg)]">
              <LivePreview
                title={meta.title}
                description={meta.description}
                fields={fields}
                color={color}
                theme={theme}
                showProgressBar={showProgressBar}
                bannerImage={bannerImage}
                logoImage={logoImage}
                device={previewDevice} />
            </div>
          </aside>
        )}
      </div>

      {/* Mobile/tablet preview overlay */}
      {previewOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-[var(--color-bg)] flex flex-col">
          <div className="flex items-center justify-between px-4 h-12 border-b-2 border-[var(--color-border)]">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">Live preview</span>
            <button onClick={() => setPreviewOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)]">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <LivePreview
              title={meta.title}
              description={meta.description}
              fields={fields}
              color={color}
              theme={theme}
              showProgressBar={showProgressBar}
              bannerImage={bannerImage}
              logoImage={logoImage}
              device="mobile" />
          </div>
        </div>
      )}
    </div>
  );
}
