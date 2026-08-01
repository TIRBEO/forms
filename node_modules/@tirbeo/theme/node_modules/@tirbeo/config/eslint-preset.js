export const config = {
  appName: "Tirbeo",
  appDomain: process.env.NEXT_PUBLIC_APP_DOMAIN || "tirbeo.app",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "https://api.tirbeo.app",
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001",
  cookieDomain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || ".tirbeo.app",
  environment: process.env.NODE_ENV || "development",
  version: process.env.npm_package_version || "0.0.1",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const colors = {
  primary: "#1A73E8",
  primaryHover: "#1557B0",
  primarySubtle: "#E8F0FE",
  text: "#202124",
  textSecondary: "#5F6368",
  muted: "#80868B",
  background: "#FFFFFF",
  surface: "#F8F9FA",
  border: "#DADCE0",
  success: "#188038",
  warning: "#F9AB00",
  error: "#D93025",
} as const;

export const typography = {
  display: { fontSize: "28px", lineHeight: "36px", fontWeight: 700 },
  heading: { fontSize: "20px", lineHeight: "28px", fontWeight: 600 },
  title: { fontSize: "16px", lineHeight: "24px", fontWeight: 600 },
  body: { fontSize: "14px", lineHeight: "22px", fontWeight: 400 },
  bodySmall: { fontSize: "13px", lineHeight: "20px", fontWeight: 400 },
  label: { fontSize: "12px", lineHeight: "16px", fontWeight: 500 },
  caption: { fontSize: "12px", lineHeight: "16px", fontWeight: 400 },
  code: { fontSize: "13px", lineHeight: "20px", fontWeight: 400 },
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
  "3xl": "64px",
} as const;

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 2px 8px rgba(0,0,0,0.08)",
  lg: "0 4px 16px rgba(0,0,0,0.12)",
  xl: "0 8px 32px rgba(0,0,0,0.16)",
} as const;

export const transitions = {
  fast: "150ms ease",
  normal: "250ms ease",
  slow: "400ms ease",
} as const;