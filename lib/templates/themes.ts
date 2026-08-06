export interface FormTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
    error: string;
    success: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    padding: string;
    borderRadius: string;
    maxWidth: string;
  };
  header: {
    showImage: boolean;
    imageUrl: string;
    height: string;
    overlay: string;
  };
  button: {
    style: 'rounded' | 'pill' | 'square' | 'outline';
    fullWidth: boolean;
  };
}

export const FORM_THEMES: FormTheme[] = [
  {
    id: 'modern-light',
    name: 'Modern Light',
    description: 'Clean and minimal with subtle shadows',
    preview: '☀️',
    colors: {
      primary: '#3b82f6',
      secondary: '#6366f1',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827',
      textMuted: '#6b7280',
      border: '#e5e7eb',
      accent: '#3b82f6',
      error: '#ef4444',
      success: '#22c55e',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    spacing: { padding: '32px', borderRadius: '12px', maxWidth: '640px' },
    header: { showImage: false, imageUrl: '', height: '200px', overlay: 'rgba(0,0,0,0.3)' },
    button: { style: 'rounded', fullWidth: false },
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Sleek dark mode with vibrant accents',
    preview: '🌙',
    colors: {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textMuted: '#9ca3af',
      border: '#374151',
      accent: '#60a5fa',
      error: '#f87171',
      success: '#4ade80',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    spacing: { padding: '32px', borderRadius: '12px', maxWidth: '640px' },
    header: { showImage: false, imageUrl: '', height: '200px', overlay: 'rgba(0,0,0,0.5)' },
    button: { style: 'rounded', fullWidth: false },
  },
  {
    id: 'gradient-blue',
    name: 'Ocean Blue',
    description: 'Beautiful blue gradient background',
    preview: '🌊',
    colors: {
      primary: '#2563eb',
      secondary: '#7c3aed',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      surface: 'rgba(255,255,255,0.95)',
      text: '#1e293b',
      textMuted: '#64748b',
      border: 'rgba(255,255,255,0.3)',
      accent: '#2563eb',
      error: '#ef4444',
      success: '#22c55e',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter' },
    spacing: { padding: '36px', borderRadius: '16px', maxWidth: '680px' },
    header: { showImage: false, imageUrl: '', height: '220px', overlay: 'rgba(0,0,0,0.4)' },
    button: { style: 'pill', fullWidth: false },
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset Glow',
    description: 'Warm orange-pink gradient',
    preview: '🌅',
    colors: {
      primary: '#f59e0b',
      secondary: '#ec4899',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      surface: 'rgba(255,255,255,0.92)',
      text: '#1f2937',
      textMuted: '#6b7280',
      border: 'rgba(255,255,255,0.3)',
      accent: '#f59e0b',
      error: '#ef4444',
      success: '#22c55e',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter' },
    spacing: { padding: '36px', borderRadius: '16px', maxWidth: '680px' },
    header: { showImage: false, imageUrl: '', height: '220px', overlay: 'rgba(0,0,0,0.4)' },
    button: { style: 'pill', fullWidth: false },
  },
  {
    id: 'nature-green',
    name: 'Nature Fresh',
    description: 'Calming green tones',
    preview: '🌿',
    colors: {
      primary: '#059669',
      secondary: '#0d9488',
      background: '#ecfdf5',
      surface: '#ffffff',
      text: '#064e3b',
      textMuted: '#4b7a62',
      border: '#a7f3d0',
      accent: '#059669',
      error: '#ef4444',
      success: '#22c55e',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    spacing: { padding: '32px', borderRadius: '12px', maxWidth: '640px' },
    header: { showImage: false, imageUrl: '', height: '180px', overlay: 'rgba(0,0,0,0.3)' },
    button: { style: 'rounded', fullWidth: false },
  },
  {
    id: 'elegant-dark',
    name: 'Elegant Noir',
    description: 'Sophisticated dark with gold accents',
    preview: '✨',
    colors: {
      primary: '#d4af37',
      secondary: '#b8860b',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#f5f5f5',
      textMuted: '#a0a0a0',
      border: '#333333',
      accent: '#d4af37',
      error: '#ef4444',
      success: '#22c55e',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter' },
    spacing: { padding: '40px', borderRadius: '8px', maxWidth: '620px' },
    header: { showImage: false, imageUrl: '', height: '240px', overlay: 'rgba(0,0,0,0.6)' },
    button: { style: 'outline', fullWidth: false },
  },
  {
    id: 'minimal-white',
    name: 'Pure Minimal',
    description: 'Ultra clean with lots of whitespace',
    preview: '⬜',
    colors: {
      primary: '#18181b',
      secondary: '#3f3f46',
      background: '#ffffff',
      surface: '#fafafa',
      text: '#18181b',
      textMuted: '#71717a',
      border: '#e4e4e7',
      accent: '#18181b',
      error: '#ef4444',
      success: '#22c55e',
    },
    fonts: { heading: 'Inter', body: 'Inter' },
    spacing: { padding: '48px', borderRadius: '4px', maxWidth: '600px' },
    header: { showImage: false, imageUrl: '', height: '160px', overlay: 'rgba(0,0,0,0.2)' },
    button: { style: 'square', fullWidth: true },
  },
  {
    id: 'warm-paper',
    name: 'Warm Paper',
    description: 'Cozy paper-like background',
    preview: '📜',
    colors: {
      primary: '#92400e',
      secondary: '#b45309',
      background: '#fef3c7',
      surface: '#fffbeb',
      text: '#451a03',
      textMuted: '#92400e',
      border: '#fcd34d',
      accent: '#92400e',
      error: '#ef4444',
      success: '#22c55e',
    },
    fonts: { heading: 'Merriweather', body: 'Inter' },
    spacing: { padding: '36px', borderRadius: '8px', maxWidth: '660px' },
    header: { showImage: false, imageUrl: '', height: '180px', overlay: 'rgba(0,0,0,0.3)' },
    button: { style: 'rounded', fullWidth: false },
  },
];

export const DEFAULT_THEME = FORM_THEMES[0];

export function getThemeById(id: string): FormTheme {
  return FORM_THEMES.find(t => t.id === id) || DEFAULT_THEME;
}

// ─── Stored theme config (settings.theme) ──────────────────────────────
// This is the shape persisted on the form and consumed by the fill page + live
// preview so both render identically.

export interface ThemeConfig {
  themeId: string;
  primaryColor: string;
  backgroundColor: string; // solid color or CSS gradient
  surfaceColor: string;
  textColor: string;
  textMutedColor: string;
  borderColor: string;
  accentColor: string;
  errorColor: string;
  borderRadius: string;
  padding: string;
  maxWidth: string;
  headingFont: string;
  bodyFont: string;
  buttonStyle: 'rounded' | 'pill' | 'square' | 'outline';
  buttonFullWidth: boolean;
  headerImageUrl: string;
  headerHeight: string;
  headerOverlay: string;
  coverImageUrl: string;
  customCSS: string;
}

export const FONT_OPTIONS = ['Inter', 'Plus Jakarta Sans', 'Playfair Display', 'Merriweather', 'Space Grotesk'];

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  themeId: 'modern-light',
  primaryColor: '#3b82f6',
  backgroundColor: '#f3f4f6',
  surfaceColor: '#ffffff',
  textColor: '#111827',
  textMutedColor: '#6b7280',
  borderColor: '#e5e7eb',
  accentColor: '#3b82f6',
  errorColor: '#ef4444',
  borderRadius: '12px',
  padding: '32px',
  maxWidth: '640px',
  headingFont: 'Inter',
  bodyFont: 'Inter',
  buttonStyle: 'rounded',
  buttonFullWidth: false,
  headerImageUrl: '',
  headerHeight: '200px',
  headerOverlay: 'rgba(0,0,0,0.35)',
  coverImageUrl: '',
  customCSS: '',
};

const FALLBACK_BG = { light: '#f3f4f6', dark: '#111827', gradient: '#2563eb' };

function pickFont(font: string | undefined, fallback: string): string {
  return typeof font === 'string' && font.trim() ? font : fallback;
}

function pickTextColor(bg: string, fallback: string): string {
  if (/linear-gradient|#(0[0-9a-f]|1[0-3])[0-9a-f]{4}/i.test(bg)) return '#ffffff';
  return fallback;
}

export function themeFromPreset(preset: FormTheme): ThemeConfig {
  return {
    themeId: preset.id,
    primaryColor: preset.colors.primary,
    backgroundColor: preset.colors.background,
    surfaceColor: preset.colors.surface,
    textColor: preset.colors.text,
    textMutedColor: preset.colors.textMuted,
    borderColor: preset.colors.border,
    accentColor: preset.colors.accent,
    errorColor: preset.colors.error,
    borderRadius: preset.spacing.borderRadius,
    padding: preset.spacing.padding,
    maxWidth: preset.spacing.maxWidth,
    headingFont: preset.fonts.heading,
    bodyFont: preset.fonts.body,
    buttonStyle: preset.button.style,
    buttonFullWidth: preset.button.fullWidth,
    headerImageUrl: preset.header.imageUrl || '',
    headerHeight: preset.header.height,
    headerOverlay: preset.header.overlay,
    coverImageUrl: '',
    customCSS: '',
  };
}

/** Normalize a partial/legacy stored theme into a complete ThemeConfig. */
export function themeFromStorage(raw: unknown): ThemeConfig {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>;
  const base: Record<string, any> = { ...DEFAULT_THEME_CONFIG };
  for (const key of Object.keys(base)) {
    const v = r[key];
    if (v !== undefined && v !== null && v !== '') base[key] = v;
  }
  // If a preset id is present but the palette is empty, apply the preset palette.
  if (typeof r.themeId === 'string' && !r.primaryColor && !r.backgroundColor) {
    const preset = FORM_THEMES.find(t => t.id === r.themeId);
    if (preset) return themeFromPreset(preset);
  }
  // Light text on a dark/gradient background.
  if (!r.textColor && /linear-gradient|#(0[0-9a-f]|1[0-3])[0-9a-f]{4}/i.test(base.backgroundColor)) {
    base.textColor = '#ffffff';
  }
  return base as ThemeConfig;
}

/** CSS variables + convenience styles a themed page can spread onto its root. */
export function themePageStyle(t: ThemeConfig): React.CSSProperties {
  return {
    background: t.backgroundColor,
    color: t.textColor,
    fontFamily: t.bodyFont,
  };
}

export function themeCardStyle(t: ThemeConfig): React.CSSProperties {
  return {
    backgroundColor: t.surfaceColor,
    border: `1px solid ${t.borderColor}`,
    borderRadius: t.borderRadius,
  };
}

export function themeButtonStyle(t: ThemeConfig): React.CSSProperties {
  const base: React.CSSProperties = {
    backgroundColor: t.primaryColor,
    color: pickTextColor(t.primaryColor, '#ffffff'),
    borderRadius: t.buttonStyle === 'pill' ? '9999px' : t.buttonStyle === 'rounded' ? '10px' : t.buttonStyle === 'square' ? '0px' : '10px',
    border: t.buttonStyle === 'outline' ? `2px solid ${t.primaryColor}` : 'none',
    width: t.buttonFullWidth ? '100%' : undefined,
  };
  if (t.buttonStyle === 'outline') {
    base.backgroundColor = 'transparent';
    base.color = t.primaryColor;
  }
  return base;
}

export function getBackgroundOptions(): { id: string; label: string; value: string; swatch: string }[] {
  const fromPresets = FORM_THEMES.filter(t => t.colors.background.startsWith('linear-gradient') || !t.colors.background.startsWith('#'))
    .concat(FORM_THEMES.filter(t => t.colors.background.startsWith('#')));
  return [
    ...fromPresets.map(t => ({ id: t.id, label: t.name, value: t.colors.background, swatch: t.colors.background.startsWith('linear-gradient') ? t.colors.surface : t.colors.background })),
    { id: 'custom-white', label: 'White', value: '#ffffff', swatch: '#ffffff' },
    { id: 'custom-dark', label: 'Near black', value: '#111827', swatch: '#111827' },
    { id: 'custom-light', label: 'Light grey', value: FALLBACK_BG.light, swatch: FALLBACK_BG.light },
  ];
}
