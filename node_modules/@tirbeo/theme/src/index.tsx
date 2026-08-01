"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type Density = "comfortable" | "compact";

export interface TirbeoTheme {
  mode: ThemeMode;
  density: Density;
  setMode: (mode: ThemeMode) => void;
  setDensity: (density: Density) => void;
}

export const TirbeoThemeContext = createContext<TirbeoTheme | undefined>(undefined);

const CSS_VARIABLES: Record<string, string> = {
  "--tirbeo-color-primary": "#1A73E8",
  "--tirbeo-color-primary-hover": "#1557B0",
  "--tirbeo-color-primary-subtle": "#E8F0FE",
  "--tirbeo-color-text": "#202124",
  "--tirbeo-color-text-secondary": "#5F6368",
  "--tirbeo-color-text-muted": "#80868B",
  "--tirbeo-color-background": "#FFFFFF",
  "--tirbeo-color-surface": "#F8F9FA",
  "--tirbeo-color-border": "#DADCE0",
  "--tirbeo-color-success": "#188038",
  "--tirbeo-color-warning": "#F9AB00",
  "--tirbeo-color-error": "#D93025",
  "--tirbeo-color-info": "#1A73E8",
  "--tirbeo-radius-sm": "4px",
  "--tirbeo-radius-md": "8px",
  "--tirbeo-radius-lg": "12px",
  "--tirbeo-radius-xl": "16px",
  "--tirbeo-shadow-sm": "0 1px 2px rgba(0,0,0,0.05)",
  "--tirbeo-shadow-md": "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  "--tirbeo-shadow-lg": "0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)",
  "--tirbeo-font-sans": "Inter, system-ui, -apple-system, sans-serif",
  "--tirbeo-font-mono": "JetBrains Mono, monospace",
  "--tirbeo-spacing-xs": "4px",
  "--tirbeo-spacing-sm": "8px",
  "--tirbeo-spacing-md": "16px",
  "--tirbeo-spacing-lg": "24px",
  "--tirbeo-spacing-xl": "32px",
  "--tirbeo-spacing-2xl": "48px",
  "--tirbeo-breakpoint-sm": "640px",
  "--tirbeo-breakpoint-md": "768px",
  "--tirbeo-breakpoint-lg": "1024px",
  "--tirbeo-breakpoint-xl": "1280px",
  "--tirbeo-z-dropdown": "100",
  "--tirbeo-z-sticky": "200",
  "--tirbeo-z-modal": "300",
  "--tirbeo-z-toast": "400",
  "--tirbeo-z-tooltip": "500",
  "--tirbeo-motion-fast": "150ms",
  "--tirbeo-motion-normal": "250ms",
  "--tirbeo-motion-slow": "350ms",
};

function setAdminThemeVars(root: HTMLElement, isDark: boolean) {
  const vars: [string, string, string][] = [
    /* Admin-specific (--color-admin-*) */
    ['--color-admin-bg', '#0f1117', '#f0f2f5'],
    ['--color-admin-surface', '#1a1d27', '#ffffff'],
    ['--color-admin-surface-hover', '#242733', '#f3f4f6'],
    ['--color-admin-text', '#f1f5f9', '#111827'],
    ['--color-admin-text-secondary', '#94a3b8', '#6b7280'],
    ['--color-admin-text-muted', '#64748b', '#9ca3af'],
    ['--color-admin-border', '#2d3140', '#e5e7eb'],
    ['--color-admin-sidebar', '#161822', '#ffffff'],
    ['--color-admin-sidebar-hover', '#1e2030', '#f3f4f6'],
    ['--color-admin-sidebar-active', '#1e293b', '#eff6ff'],
    ['--color-admin-topbar', 'rgba(15,17,23,0.85)', 'rgba(255,255,255,0.8)'],
    ['--color-admin-accent', '#3b82f6', '#2563eb'],
    /* General theme (used by dashboard, forms, etc.) */
    ['--color-bg', '#0f1117', '#f8f9fa'],
    ['--color-surface', '#1a1d27', '#ffffff'],
    ['--color-surface-muted', '#242733', '#f3f4f6'],
    ['--color-surface-raised', '#2d3140', '#e5e7eb'],
    ['--color-text', '#f1f5f9', '#111827'],
    ['--color-text-secondary', '#94a3b8', '#6b7280'],
    ['--color-text-tertiary', '#64748b', '#9ca3af'],
    ['--color-border', '#2d3140', '#e5e7eb'],
    ['--color-sidebar', '#161822', '#ffffff'],
    ['--color-sidebar-hover', '#1e2030', '#f3f4f6'],
    ['--color-sidebar-active', '#1e293b', '#eff6ff'],
    ['--color-header', '#1a1d27', '#ffffff'],
    /* Shared semantic colors */
    ['--color-primary', '#3b82f6', '#2563eb'],
    ['--color-primary-hover', '#60a5fa', '#1d4ed8'],
    ['--color-primary-surface', '#1e3a5f', '#eff6ff'],
    ['--color-success', '#10b981', '#059669'],
    ['--color-success-surface', '#064e3b', '#ecfdf5'],
    ['--color-error', '#ef4444', '#dc2626'],
    ['--color-error-surface', '#450a0a', '#fef2f2'],
    ['--color-warning', '#f59e0b', '#d97706'],
    ['--color-warning-surface', '#451a03', '#fffbeb'],
    ['--color-info', '#38bdf8', '#0284c7'],
    ['--color-info-surface', '#0c4a6e', '#f0f9ff'],
    /* Inline-style shorthands */
    ['--bg-canvas', '#0f1117', '#f0f2f5'],
    ['--bg-surface', '#1a1d27', '#ffffff'],
    ['--bg-elevated', '#242733', '#f3f4f6'],
    ['--bg-hover', '#242733', '#f3f4f6'],
    ['--bg-inset', '#0a0b10', '#e8eaed'],
    ['--border-default', '#2d3140', '#e5e7eb'],
    ['--border-elevated', '#3b3f50', '#d1d5db'],
    ['--border-muted', '#252835', '#f3f4f6'],
    ['--border-subtle', '#2a2d3a', '#e8eaed'],
    ['--text-primary', '#f1f5f9', '#111827'],
    ['--text-secondary', '#94a3b8', '#6b7280'],
    ['--text-muted', '#64748b', '#9ca3af'],
    ['--accent', '#3b82f6', '#2563eb'],
    ['--danger', '#ef4444', '#dc2626'],
    ['--warning', '#f59e0b', '#d97706'],
  ];
  for (const [name, dark, light] of vars) {
    root.style.setProperty(name, isDark ? dark : light);
  }
}

function applyThemeVariables(mode: ThemeMode) {
  const root = document.documentElement;
  const isDark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    root.style.setProperty("--tirbeo-color-text", "#f4f4f6");
    root.style.setProperty("--tirbeo-color-text-secondary", "#cdcdcd");
    root.style.setProperty("--tirbeo-color-text-muted", "#9c9c9d");
    root.style.setProperty("--tirbeo-color-background", "#0d0d0d");
    root.style.setProperty("--tirbeo-color-surface", "#101111");
    root.style.setProperty("--tirbeo-color-border", "#242728");
  } else {
    root.style.setProperty("--tirbeo-color-text", "#202124");
    root.style.setProperty("--tirbeo-color-text-secondary", "#5F6368");
    root.style.setProperty("--tirbeo-color-text-muted", "#80868B");
    root.style.setProperty("--tirbeo-color-background", "#FFFFFF");
    root.style.setProperty("--tirbeo-color-surface", "#F8F9FA");
    root.style.setProperty("--tirbeo-color-border", "#DADCE0");
  }

  for (const [varName, value] of Object.entries(CSS_VARIABLES)) {
    root.style.setProperty(varName, value);
  }

  setAdminThemeVars(root, isDark);
}

export function TirbeoThemeProvider({
  children,
  defaultMode = "light",
  defaultDensity = "comfortable",
}: {
  children: ReactNode;
  defaultMode?: ThemeMode;
  defaultDensity?: Density;
}) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [density, setDensity] = useState<Density>(defaultDensity);

  useEffect(() => {
    applyThemeVariables(mode);

    if (mode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyThemeVariables("system");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [mode]);

  return (
    <TirbeoThemeContext.Provider value={{ mode, density, setMode, setDensity }}>
      {children}
    </TirbeoThemeContext.Provider>
  );
}

export function useTirbeoTheme(): TirbeoTheme {
  const context = useContext(TirbeoThemeContext);
  if (context === undefined) {
    throw new Error("useTirbeoTheme must be used within a TirbeoThemeProvider");
  }
  return context;
}

export { CSS_VARIABLES };