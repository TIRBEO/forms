import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TirbeoThemeProvider } from "@tirbeo/theme";
import { ThemeToggle } from "./components/theme-toggle";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tirbeo Forms",
  description: "Create powerful forms with Tirbeo",
};

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <TirbeoThemeProvider>
          <ThemeToggle />
          {children}
        </TirbeoThemeProvider>
      </body>
    </html>
  );
}
