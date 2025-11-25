# Design System Documentation

## Overview

This document establishes the design standards for the Odyssey Tableau Mailer UI. All components and pages should follow these guidelines to maintain visual consistency across the application.

---

## Color Palette

### Primary Brand Color
**Purple** - Used for primary actions, links, and brand identity
- `purple-50`: #faf5ff (light backgrounds)
- `purple-500`: #a855f7 (primary actions)
- `purple-600`: #9333ea (hover states)
- `purple-300`: #d8b4fe (disabled states)

### Semantic Colors
- **Success**: `green-500` (#10b981), `green-600` (#059669)
- **Error/Danger**: `red-500` (#ef4444), `red-600` (#dc2626)
- **Warning**: `yellow-500` (#eab308), `orange-500` (#f97316)
- **Info**: Purple (use primary color)

### Neutral Colors
- **Text**:
  - Primary text: `gray-900` (#111827)
  - Secondary text: `gray-600` (#4b5563)
  - Tertiary text: `gray-500` (#6b7280)
  - Placeholder text: `gray-400` (#9ca3af)

- **Backgrounds**:
  - Page background: `gray-50` (#f9fafb)
  - Card/Container: `white` (#ffffff)
  - Hover background: `gray-100` (#f3f4f6)

- **Borders**:
  - Default: `gray-200` (#e5e7eb)
  - Hover: `gray-300` (#d1d5db)

---

## Typography

### Font Sizes (Chakra UI)
- **3xl**: Page titles (approx. 1.875rem / 30px)
- **xl**: Section headings (approx. 1.25rem / 20px)
- **lg**: Subsection headings (approx. 1.125rem / 18px)
- **md**: Body text, default (approx. 1rem / 16px)
- **sm**: Small text, labels (approx. 0.875rem / 14px)
- **xs**: Fine print (approx. 0.75rem / 12px)

### Font Sizes (Tailwind)
- `text-3xl`: Page titles
- `text-xl`: Section headings
- `text-lg`: Subsection headings
- `text-base`: Body text, default
- `text-sm`: Small text, labels
- `text-xs`: Fine print

### Font Weights
- **bold**: Headings, important text (`font-bold` / `fontWeight="bold"`)
- **semibold**: Subheadings (`font-semibold` / `fontWeight="semibold"`)
- **medium**: Labels, emphasis (`font-medium` / `fontWeight="medium"`)
- **normal**: Body text (default)

### Text Colors
- Primary text: `text-gray-900` / `color="gray.900"`
- Secondary text: `text-gray-600` / `color="gray.600"`
- Muted text: `text-gray-500` / `color="gray.500"`

---

## Spacing Scale

Both Chakra UI and Tailwind use a spacing scale where 1 unit = 0.25rem = 4px

### Common Spacing Values
- `2` / `0.5rem` / `8px`: Tight spacing
- `3` / `0.75rem` / `12px`: Small spacing
- `4` / `1rem` / `16px`: Default spacing
- `6` / `1.5rem` / `24px`: Medium spacing
- `8` / `2rem` / `32px`: Large spacing
- `12` / `3rem` / `48px`: Extra large spacing

### Usage Guidelines
- **Component padding**: `p-4` / `p={4}` to `p-6` / `p={6}`
- **Section spacing**: `mb-6` / `mb={6}` to `mb-8` / `mb={8}`
- **Element gaps**: `gap-3` / `gap={3}` to `gap-4` / `gap={4}`
- **Page padding**: `p-8` / `p={8}`

---

## Components

### Buttons

#### Primary Button
**Purpose**: Main call-to-action buttons

**Chakra UI**:
```tsx
<Button
  colorScheme="purple"
  size="lg"
  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
>
  Button Text
</Button>
```

**Tailwind**:
```tsx
<button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed">
  Button Text
</button>
```

#### Secondary Button
**Purpose**: Alternative actions

**Chakra UI**:
```tsx
<Button variant="outline" colorScheme="purple" size="lg">
  Button Text
</Button>
```

**Tailwind**:
```tsx
<button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
  Button Text
</button>
```

#### Danger/Delete Button
**Purpose**: Destructive actions

**Chakra UI**:
```tsx
<Button colorScheme="red" size="lg">
  Delete
</Button>
```

**Tailwind**:
```tsx
<button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
  Delete
</button>
```

#### Success Button
**Purpose**: Positive confirmation actions

**Chakra UI**:
```tsx
<Button colorScheme="green" size="lg">
  Confirm
</Button>
```

**Tailwind**:
```tsx
<button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
  Confirm
</button>
```

#### Button Sizes
- **Large** (default for primary actions): `size="lg"` / `px-4 py-2`
- **Medium** (secondary actions): `size="md"` / `px-3 py-1.5`
- **Small** (tertiary actions): `size="sm"` / `px-3 py-1`

---

### Input Fields

#### Standard Input
**Chakra UI**:
```tsx
<Input
  size="lg"
  placeholder="Enter text"
  css={{
    color: 'var(--chakra-colors-gray-900)',
    '&::placeholder': { color: 'var(--chakra-colors-gray-400)' }
  }}
/>
```

**Tailwind**:
```tsx
<input
  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
  placeholder="Enter text"
/>
```

#### Input with Label
```tsx
<Box>
  <Text fontSize="sm" fontWeight="medium" mb={2}>
    Label Name <Text as="span" color="red.500">*</Text>
  </Text>
  <Input ... />
</Box>
```

#### Focus State
- Focus ring: 2px solid purple-500
- Use `focus:ring-2 focus:ring-purple-500` (Tailwind)
- Use `_focus={{ borderColor: 'purple.500', boxShadow: '...' }}` (Chakra)

#### Error State
- Border color: `red-500`
- Error message: `text-red-500`, `text-sm`, display below input

---

### Cards & Containers

#### Standard Card
**Chakra UI**:
```tsx
<Box
  bg="white"
  borderRadius="lg"
  boxShadow="md"
  p={6}
  borderWidth={1}
  borderColor="gray.200"
>
  {/* Content */}
</Box>
```

**Tailwind**:
```tsx
<div className="bg-white rounded-lg shadow p-6 border border-gray-200">
  {/* Content */}
</div>
```

#### Elevated Card
**Chakra UI**:
```tsx
<Box
  bg="white"
  borderRadius="2xl"
  boxShadow="2xl"
  p={8}
>
  {/* Content */}
</Box>
```

**Tailwind**:
```tsx
<div className="bg-white rounded-2xl shadow-2xl p-8">
  {/* Content */}
</div>
```

#### Card with Hover Effect
**Tailwind**:
```tsx
<div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer">
  {/* Content */}
</div>
```

---

### Loading States

#### Spinner (Chakra UI)
```tsx
<Spinner size="xl" color="purple.500" />
```

#### Spinner (Tailwind)
```tsx
<div className="flex justify-center items-center h-screen">
  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
</div>
```

---

### Tables

#### Standard Table (Tailwind)
```tsx
<div className="bg-white rounded-lg shadow overflow-hidden">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Header
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          Cell content
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### Badges & Status Indicators

#### Success Badge
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-green-100 text-green-800 border-green-200">
  Success
</span>
```

#### Error Badge
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-red-100 text-red-800 border-red-200">
  Error
</span>
```

#### Warning Badge
```tsx
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-yellow-100 text-yellow-800 border-yellow-200">
  Warning
</span>
```

---

### Alerts & Notifications

#### Success Alert
```tsx
<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
  <span className="block sm:inline">Success message</span>
</div>
```

#### Error Alert
```tsx
<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
  <span className="block sm:inline">Error message</span>
</div>
```

#### Warning Alert
```tsx
<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
  <span className="block sm:inline">Warning message</span>
</div>
```

---

## Layout Patterns

### Page Wrapper
```tsx
<div className="min-h-screen bg-gray-50 p-8">
  <div className="max-w-7xl mx-auto">
    {/* Page content */}
  </div>
</div>
```

### Page with Header
```tsx
<div className="min-h-screen bg-gray-50 p-8">
  <div className="max-w-7xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Page Title</h1>
    {/* Content */}
  </div>
</div>
```

### Page with Header and Action Button
```tsx
<div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold text-gray-900">Page Title</h1>
  <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
    Action
  </button>
</div>
```

### Two-Column Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>{/* Column 1 */}</div>
  <div>{/* Column 2 */}</div>
</div>
```

### Four-Column Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Cards */}
</div>
```

---

## Icons

### Icon Usage
- Use icons from `react-icons/fi` (Feather Icons) for consistency
- Default icon size: `w-6 h-6` / `boxSize={6}`
- Icon color should match text or use purple for emphasis

**Example (Chakra UI)**:
```tsx
<Icon as={FiUsers} boxSize={6} color="purple.500" />
```

**Example (Tailwind)**:
```tsx
<FiUsers className="w-6 h-6 text-purple-500" />
```

---

## Responsive Design

### Breakpoints
- **Mobile**: < 768px (md)
- **Tablet**: 768px - 1024px (md - lg)
- **Desktop**: > 1024px (lg+)

### Mobile-First Approach
Always design for mobile first, then add responsive classes:
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
```

---

## Accessibility

### Labels
- Always provide labels for form inputs
- Use `aria-label` for icon-only buttons
- Mark required fields with visual indicator (*)

### Focus States
- All interactive elements must have visible focus states
- Use purple ring: `focus:ring-2 focus:ring-purple-500`

### Color Contrast
- Ensure text has sufficient contrast against backgrounds
- Primary text (`gray-900`) on white backgrounds meets WCAG AA standards
- Avoid using color alone to convey information

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Provide proper tab order
- Support Enter/Space for buttons

---

## Animation & Transitions

### Hover Transitions
```tsx
className="transition-shadow hover:shadow-lg"
className="transition-colors hover:bg-purple-600"
```

### Loading Animations
```tsx
className="animate-spin"
```

### Subtle Transforms
```tsx
_hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
```

---

## Best Practices

### DO:
✅ Use purple as the primary brand color consistently
✅ Ensure all input text is visible (text-gray-900)
✅ Provide clear focus states for accessibility
✅ Use consistent spacing (4px increments)
✅ Follow mobile-first responsive design
✅ Use semantic HTML elements
✅ Provide loading and error states

### DON'T:
❌ Mix blue and purple as primary colors
❌ Use `color="gray.600"` prop on Chakra Input components (affects border, not text)
❌ Forget placeholder text colors
❌ Use inconsistent button sizes within the same context
❌ Skip accessibility attributes
❌ Hardcode colors that aren't in the design system

---

## Component Migration

### From Tailwind to Chakra UI
When migrating Tailwind components to Chakra UI:

1. Replace `className` with Chakra props:
   - `bg-white` → `bg="white"`
   - `rounded-lg` → `borderRadius="lg"`
   - `shadow` → `boxShadow="md"`
   - `p-6` → `p={6}`

2. Replace HTML elements with Chakra components:
   - `<div>` → `<Box>`
   - `<button>` → `<Button>`
   - `<input>` → `<Input>`

3. Use Chakra's responsive syntax:
   - `className="grid md:grid-cols-2"` → `<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>`

---

## File Structure

### Component Organization
```
src/
├── components/
│   ├── ui/                 # Reusable Chakra UI components
│   ├── layout/             # Layout components
│   └── [feature]/          # Feature-specific components
├── pages/
│   ├── Auth/               # Authentication pages (Chakra UI)
│   ├── Dashboard/          # Dashboard pages (Chakra UI)
│   └── [resource]/         # Resource-specific pages
├── config/
│   └── constants.ts        # App constants including colors
└── types/
    └── api.ts              # TypeScript types
```

---

## Version History

### v1.0 (Current)
- Fixed all input field text visibility issues
- Standardized color scheme to purple
- Established consistent spacing and typography
- Documented component patterns
- Created accessibility guidelines

---

## Future Improvements

1. **Create Theme Configuration**: Centralize all design tokens in a theme configuration file
2. **Component Library**: Build reusable wrapper components for common patterns
3. **Dark Mode**: Implement dark mode support
4. **Animation Library**: Standardize all animations and transitions
5. **Complete Tailwind Migration**: Migrate remaining Tailwind pages to Chakra UI for consistency

---

## Support & Questions

For questions about the design system or to propose changes, please:
1. Review this documentation first
2. Check existing components for reference implementations
3. Discuss significant changes with the team before implementing

**Remember**: Consistency is key to a great user experience!
