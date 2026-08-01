# @tirbeo/ui

Tirbeo's shared design system component library.

## Installation

```bash
pnpm add @tirbeo/ui
```

## Setup

Import components from `@tirbeo/ui`:

```tsx
import { Button, Card, DataTable } from "@tirbeo/ui";
```

## Theme

All components use CSS custom properties from `@tirbeo/theme`. Wrap your app with `TirbeoThemeProvider`:

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

## Components

| Component | Description |
|-----------|-------------|
| `Button` | Primary, secondary, tertiary, danger variants |
| `IconButton` | Icon-only button with accessible label |
| `Input` | Text input with validation states |
| `Textarea` | Multi-line text input |
| `SearchInput` | Search field with icon |
| `Card` | Container with thin border and minimal shadow |
| `Badge` | Status and count badges |
| `Avatar` | User avatar with group support |
| `DataTable` | Enterprise data table with sorting, filtering, pagination |
| `Dialog` | Modal dialog with confirm/danger variants |
| `Drawer` | Slide-in panel from left |
| `Tabs` | Tab list with thin active indicator |
| `DropdownMenu` | Context menu with keyboard navigation |
| `Sidebar` | Navigation sidebar with expanded/collapsed states |
| `Topbar` | Application header with search, notifications, user menu |
| `Toast` | Toast notifications with provider |
| `Pagination` | Pagination controls |
| `Skeleton` | Loading skeleton screens |
| `EmptyState` | Empty state illustration |
| `ErrorState` | Error state with retry |

## Props

All components accept standard HTML props plus Tirbeo-specific props:

- `variant` — visual variant (primary, secondary, tertiary, danger)
- `size` — compact, default, large
- `disabled` — disabled state
- `loading` — loading state with spinner
- `className` — additional CSS classes

## Accessibility

All components support:

- Keyboard navigation
- Focus management
- Screen reader semantics
- ARIA attributes
- Color contrast (WCAG AA)
- `prefers-reduced-motion`

## Responsive Behavior

Components adapt to mobile, tablet, and desktop breakpoints using CSS custom properties from `@tirbeo/theme`.