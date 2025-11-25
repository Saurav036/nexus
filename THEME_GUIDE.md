# Theme Customization Guide

Your application now has a centralized theme system! All colors, button styles, and component configurations are in one place.

## 📁 Theme Files Location

```
packages/ui/src/theme/
├── index.ts         - Main theme system configuration
├── colors.ts        - All color definitions
├── components.ts    - Component-specific styles
└── README.md        - Detailed documentation
```

## 🎨 Quick Start: Change Colors

### Step 1: Open the colors file

```
packages/ui/src/theme/colors.ts
```

### Step 2: Update your brand color

Find the `primary` object and change the values:

```typescript
primary: {
  500: "#8b5cf6",   // Change this to your main brand color
  600: "#7c3aed",   // Change this to a slightly darker version (for hover)
}
```

### Step 3: Save and reload

Your changes will apply across the entire application automatically!

## 🔧 Common Customizations

### Change Button Colors

**File:** `src/theme/index.ts`

```typescript
button: {
  variants: {
    solid: {
      purple: {
        bg: "purple.600",        // Button background
        color: "white",           // Button text
        _hover: {
          bg: "purple.700",       // Hover background
        },
      },
    },
  },
}
```

### Change Text Colors Globally

**File:** `src/theme/colors.ts`

```typescript
gray: {
  900: "#111827",   // Primary text (darkest)
  700: "#374151",   // Secondary text
  600: "#4b5563",   // Muted text
}
```

### Change Auth Page Gradient

**File:** `src/theme/colors.ts`

```typescript
gradient: {
  start: "#667eea",  // Start color
  end: "#764ba2",    // End color
}
```

### Change Default Background Color

**File:** `src/theme/index.ts`

```typescript
globalCss: {
  body: {
    bg: "gray.50",      // App background color
    color: "gray.900",  // Default text color
  },
}
```

## 📚 Available Color Schemes

Your app now has these color schemes defined:

- **primary** - Purple (main brand color)
- **secondary** - Blue
- **success** - Green
- **error** - Red
- **warning** - Orange
- **gray** - Neutral colors

Use them in components like this:

```tsx
<Button colorScheme="purple">Purple Button</Button>
<Button colorScheme="blue">Blue Button</Button>
<Badge colorScheme="success">Success</Badge>
```

## 🎯 Button Variants

### Solid Buttons (filled)

```tsx
<Button colorScheme="purple">Solid Purple</Button>
<Button colorScheme="blue">Solid Blue</Button>
```

### Outline Buttons (border only)

```tsx
<Button variant="outline" colorScheme="purple">Outline Purple</Button>
<Button variant="outline" colorScheme="blue">Outline Blue</Button>
```

### Ghost Buttons (transparent)

```tsx
<Button variant="ghost" colorScheme="purple">Ghost Purple</Button>
<Button variant="ghost" colorScheme="gray">Ghost Gray</Button>
```

## 📏 Button Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
```

## 🎨 Using Colors in Components

### Method 1: Color Tokens

```tsx
<Box bg="primary.600" color="white">
  Content with purple background
</Box>

<Text color="gray.700">
  Secondary text
</Text>
```

### Method 2: Direct Color Names

```tsx
<Box bg="purple.600">Purple background</Box>
<Text color="gray.600">Muted text</Text>
```

## 🔄 How Changes Apply

1. **Edit theme files** in `src/theme/`
2. **Save the file**
3. **Refresh browser** (automatic with dev server)
4. Changes apply **globally across all pages**

## 📖 Example Customizations

### Example 1: Change to Blue Theme

In `colors.ts`, swap the primary and secondary:

```typescript
primary: {
  50: "#eff6ff",
  500: "#3b82f6",   // Blue as primary
  600: "#2563eb",
  900: "#1e3a8a",
}
```

### Example 2: Add Custom Color Scheme

In `colors.ts`, add new color:

```typescript
export const colors = {
  // ... existing colors
  custom: {
    50: "#fef3c7",
    500: "#f59e0b",
    600: "#d97706",
    900: "#78350f",
  },
}
```

Then use it: `<Button colorScheme="custom">Custom Button</Button>`

### Example 3: Make All Buttons Rounded

In `index.ts`, update button base:

```typescript
button: {
  base: {
    borderRadius: "full",  // Makes all buttons pill-shaped
  },
}
```

## 🎯 What's Configured

✅ **Colors**
- Primary (Purple)
- Secondary (Blue)
- Success (Green)
- Error (Red)
- Warning (Orange)
- Gray scale
- Gradient colors

✅ **Components**
- Buttons (all variants and sizes)
- Inputs (border, focus states)
- Headings
- Text
- Badges
- Spinners
- Tables

✅ **States**
- Hover effects
- Active states
- Focus styles
- Disabled states

## 📝 Need More Help?

Check the detailed README in the theme folder:
```
packages/ui/src/theme/README.md
```

Or refer to:
- [Chakra UI Theme Docs](https://www.chakra-ui.com/docs/theming/customize-theme)
- [Chakra UI Components](https://www.chakra-ui.com/docs/components)

## 🚀 Pro Tips

1. **Use semantic color names** - Instead of `purple.600`, use theme tokens
2. **Test thoroughly** - Check all pages after making color changes
3. **Keep contrast high** - Ensure text is readable on backgrounds
4. **Document changes** - Add notes when you customize the theme
5. **Use colorScheme prop** - Let Chakra handle color variations automatically

---

**Current Theme:**
- Primary: Purple (#8b5cf6)
- Secondary: Blue (#3b82f6)
- Background: Light Gray (#f9fafb)
- Text: Dark Gray (#111827)
