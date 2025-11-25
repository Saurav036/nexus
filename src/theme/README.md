# Theme Configuration Guide

This directory contains all the theme configuration for your application. You can customize colors, component styles, and more from this central location.

## File Structure

```
theme/
├── index.ts      - Main theme configuration (component styles, variants)
├── colors.ts     - Color palette definitions
└── README.md     - This file
```

## Quick Start: Changing Colors

### 1. Update Brand Colors

Open `colors.ts` and modify the color values:

```typescript
primary: {
  50: "#f5f3ff",
  500: "#8b5cf6",   // Main primary color - Change this!
  600: "#7c3aed",   // Hover state - Change this!
  900: "#4c1d95",
}
```

### 2. Update Gradient Colors

For the auth pages gradient background:

```typescript
gradient: {
  start: "#667eea",  // Start color
  end: "#764ba2",    // End color
}
```

### 3. Update Text Colors

In your components, text will use:
- `gray.900` - Primary text (darkest)
- `gray.700` - Secondary text
- `gray.600` - Muted text
- `gray.400` - Disabled text

Change these in the `colors.ts` file under the `gray` object.

## Component Styling

### Button Styles

All button styles are defined in `index.ts`. Current configuration:

**Solid Buttons** (filled background):
- Purple: `colorScheme="purple"` - Uses purple.600, hovers to purple.700
- Blue: `colorScheme="blue"` - Uses blue.600, hovers to blue.700
- Black: `colorScheme="black"` - Uses black, hovers to gray.800

**Outline Buttons** (transparent with border):
- Purple: `variant="outline" colorScheme="purple"`
- Blue: `variant="outline" colorScheme="blue"`

**Ghost Buttons** (transparent, no border):
- Purple: `variant="ghost" colorScheme="purple"`
- Gray: `variant="ghost" colorScheme="gray"`

### How to Customize Button Colors

In `index.ts`, find the button recipe:

```typescript
button: {
  variants: {
    solid: {
      purple: {
        bg: "purple.600",        // Background color
        color: "white",           // Text color
        _hover: {
          bg: "purple.700",       // Hover background
          transform: "translateY(-2px)",
          boxShadow: "lg",
        },
        _active: {
          bg: "purple.800",       // Active/clicked state
        },
      },
    },
  },
}
```

## Common Customization Examples

### Example 1: Change Primary Brand Color to Green

In `colors.ts`:

```typescript
primary: {
  50: "#f0fdf4",
  100: "#dcfce7",
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e",   // Main color
  600: "#16a34a",   // Hover
  700: "#15803d",
  800: "#166534",
  900: "#14532d",
}
```

### Example 2: Add a New Button Variant

In `index.ts`, add to the button variants:

```typescript
solid: {
  // ... existing variants
  custom: {
    bg: "teal.500",
    color: "white",
    _hover: {
      bg: "teal.600",
    },
  },
}
```

Then use it: `<Button colorScheme="custom">My Button</Button>`

### Example 3: Change Default Button Size

In `index.ts`, add to button base:

```typescript
button: {
  base: {
    fontWeight: "semibold",
    borderRadius: "md",
    fontSize: "lg",           // Add this
    height: "12",             // Add this
  },
}
```

## Global Styles

### Background Colors

The default background for the app is set in `index.ts`:

```typescript
globalCss: {
  body: {
    bg: "gray.50",      // Change this for app background
    color: "gray.900",  // Change this for default text color
  },
}
```

### Border Radius

To change the roundness of components globally:

```typescript
button: {
  base: {
    borderRadius: "md",  // Options: sm, md, lg, xl, full
  },
}
```

## Using Colors in Components

### Method 1: Using Color Tokens

```tsx
<Box bg="primary.600" color="white">
  Content
</Box>
```

### Method 2: Using Semantic Tokens

```tsx
<Text color="text.primary">Primary text</Text>
<Text color="text.secondary">Secondary text</Text>
<Text color="text.muted">Muted text</Text>
```

### Method 3: Direct Color Values

```tsx
<Box bg="purple.600">Content</Box>
<Text color="gray.700">Text</Text>
```

## Applying Theme Changes

After modifying the theme files:

1. Save the files
2. Your dev server should automatically reload
3. If changes don't appear, try:
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Restart dev server

## Color Reference

### Purple (Primary)
- 50: Very light purple (backgrounds)
- 500: Medium purple (default)
- 600: Dark purple (buttons)
- 900: Very dark purple (text)

### Gray (Neutral)
- 50: Very light gray (subtle backgrounds)
- 200: Light gray (borders)
- 600: Medium gray (muted text)
- 900: Very dark gray (primary text)

### Gradient
- start: First color of gradient
- end: Last color of gradient

## Best Practices

1. **Use semantic tokens** when possible (e.g., `text.primary` instead of `gray.900`)
2. **Keep hover states** darker than the default state
3. **Maintain contrast** - ensure text is readable on backgrounds
4. **Test thoroughly** after changing colors
5. **Document custom changes** in this README

## Need Help?

- [Chakra UI Theme Docs](https://www.chakra-ui.com/docs/theming/customize-theme)
- [Chakra UI Color Mode](https://www.chakra-ui.com/docs/theming/color-mode)
- [Chakra UI Component Styling](https://www.chakra-ui.com/docs/components)

## Current Theme Summary

- **Primary Color**: Purple (#8b5cf6)
- **Secondary Color**: Blue (#3b82f6)
- **Success Color**: Green (#22c55e)
- **Error Color**: Red (#ef4444)
- **Background**: Light gray (#f9fafb)
- **Text**: Dark gray (#111827)
- **Gradient**: Purple gradient (#667eea to #764ba2)
