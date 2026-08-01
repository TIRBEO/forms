# @tirbeo/theme

Tirbeo design tokens, CSS variables, and theme provider.

## Installation

```bash
pnpm add @tirbeo/theme
```

## Provider

Wrap your application with `TirbeoThemeProvider`:

```tsx
import { TirbeoThemeProvider } from "@tirbeo/theme";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TirbeoThemeProvider>{children}</TirbeoThemeProvider>
      </body>
    </html>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Application content |
| `defaultMode` | `"light" \| "dark" \| "system"` | `"light"` | Initial theme mode |
| `defaultDensity` | `"comfortable" \| "compact"` | `"comfortable"` | Initial density |

## Tokens

### CSS Custom Properties

All design tokens are exposed as CSS custom properties:

| Token | Value |
|-------|-------|
| `--tirbeo-color-primary` | `#1A73E8` |
| `--tirbeo-color-text` | `#202124` |
| `--tirbeo-color-background` | `#FFFFFF` |
| `--tirbeo-color-surface` | `#F8F9FA` |
| `--tirbeo-color-border` | `#DADCE0` |
| `--tirbeo-radius-md` | `8px` |
| `--tirbeo-spacing-md` | `16px` |
| `--tirbeo-font-sans` | `Inter, system-ui, sans-serif` |

### Dark Mode

Dark mode uses intentional semantic tokens — not a simple inversion:

| Token | Light | Dark |
|-------|-------|------|
| `--tirbeo-color-text` | `#202124` | `#f4f4f6` |
| `--tirbeo-color-surface` | `#F8F9FA` | `#101111` |
| `--tirbeo-color-border` | `#DADCE0` | `#242728` |

## Customization

Applications can customize:

- **Theme mode** — light, dark, or system
- **Density** — comfortable or compact
- **App-specific identity** — icon, name, and contextual controls only

Do NOT customize:

- Color palette (use tokens)
- Typography scale (use tokens)
- Spacing scale (use tokens)
- Component structure (use shared components)

## Usage in Components

Use CSS custom properties, never hardcode values:

```css
/* ✅ DO */
color: var(--tirbeo-color-text);

/* ❌ DON'T */
color: #202124;
```