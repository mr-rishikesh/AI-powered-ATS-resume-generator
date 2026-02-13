'use client';

// Simple provider - no dark mode, just Vercel light theme
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
