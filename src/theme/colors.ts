/**
 * Global Color Palette
 *
 * Change these values to update colors across your entire application.
 * Each color has shades from 50 (lightest) to 900 (darkest).
 */

export const colors = {
  // Primary Brand Color (Purple)
  // Used for: Primary buttons, links, active states
  primary: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",   // Main primary color
    600: "#7c3aed",   // Hover state
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
  },

  // Secondary Color (Blue)
  // Used for: Secondary buttons, info badges, accents
  secondary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",   // Main secondary color
    600: "#2563eb",   // Hover state
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },

  // Success Color (Green)
  // Used for: Success messages, positive states
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",   // Main success color
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Error Color (Red)
  // Used for: Error messages, destructive actions
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",   // Main error color
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Warning Color (Orange/Yellow)
  // Used for: Warning messages, caution states
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",   // Main warning color
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Neutral/Gray Colors
  // Used for: Text, borders, backgrounds, disabled states
  gray: {
    50: "#f9fafb",    // Light background
    100: "#f3f4f6",   // Muted background
    200: "#e5e7eb",   // Border color
    300: "#d1d5db",   // Input border
    400: "#9ca3af",   // Disabled text
    500: "#6b7280",
    600: "#4b5563",   // Muted text
    700: "#374151",   // Secondary text
    800: "#1f2937",
    900: "#111827",   // Primary text
  },

  // Gradient Colors
  // Used for: Auth pages background gradient
  gradient: {
    start: "#667eea",  // Purple-ish blue
    end: "#764ba2",    // Purple
  },
}

/**
 * Quick Reference:
 *
 * To change your brand color:
 * - Update the `primary` object values
 *
 * To change button colors:
 * - Update `primary.600` for default button background
 * - Update `primary.700` for hover state
 *
 * To change text colors:
 * - Update `gray.900` for primary text
 * - Update `gray.700` for secondary text
 * - Update `gray.600` for muted text
 *
 * To change the auth page gradient:
 * - Update `gradient.start` and `gradient.end`
 */
