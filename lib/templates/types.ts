export interface FormThemeConfig {
  themeId: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderRadius: string;
  fontFamily: string;
  headerImageUrl: string;
  coverImageUrl: string;
  customCSS: string;
  padding?: string;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  theme: FormThemeConfig;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'file';
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
  order: number;
}

export const DEFAULT_THEME_CONFIG: FormThemeConfig = {
  themeId: 'modern-light',
  primaryColor: '#3b82f6',
  backgroundColor: '#ffffff',
  textColor: '#111827',
  accentColor: '#3b82f6',
  borderRadius: '12px',
  fontFamily: 'Inter',
  headerImageUrl: '',
  coverImageUrl: '',
  customCSS: '',
};
