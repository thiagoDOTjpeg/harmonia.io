"use client";

import { useEffect } from "react";

// React 19 + next-themes compatibility patch for development.
// next-themes renders an inline <script> tag for SSR theme hydration.
// React 19 flags inline scripts in client components with a false-positive warning
// that triggers the Next.js dev overlay.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const firstArg = typeof args[0] === "string" ? args[0] : "";
    if (
      firstArg.includes("Encountered a script tag") ||
      firstArg.includes("Scripts inside React components are never executed")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

export function SuppressConsoleWarnings() {
  useEffect(() => {
    // Ensure console.error remains wrapped if Turbopack resets it
    if (process.env.NODE_ENV === "development") {
      const originalError = console.error;
      console.error = (...args: unknown[]) => {
        const firstArg = typeof args[0] === "string" ? args[0] : "";
        if (
          firstArg.includes("Encountered a script tag") ||
          firstArg.includes("Scripts inside React components are never executed")
        ) {
          return;
        }
        originalError.apply(console, args);
      };
    }
  }, []);

  return null;
}

