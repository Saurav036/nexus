/**
 * Component Style Configurations
 *
 * This file contains style definitions for individual components.
 * Modify these to change how components look across your entire app.
 */

export const componentStyles = {
  // Button Component
  button: {
    // Base styles applied to all buttons
    baseStyle: {
      fontWeight: "semibold",
      borderRadius: "md",
      transition: "all 0.2s ease-in-out",
    },

    // Size variants
    sizes: {
      sm: {
        fontSize: "sm",
        px: 4,
        py: 2,
        height: "8",
      },
      md: {
        fontSize: "md",
        px: 6,
        py: 3,
        height: "10",
      },
      lg: {
        fontSize: "lg",
        px: 8,
        py: 4,
        height: "12",
      },
      xl: {
        fontSize: "xl",
        px: 10,
        py: 5,
        height: "14",
      },
    },

    // Default size
    defaultSize: "md",
  },

  // Input Component
  input: {
    baseStyle: {
      borderRadius: "md",
      borderWidth: "1px",
      borderColor: "gray.300",
    },
    focusStyle: {
      borderColor: "purple.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
    },
  },

  // Card/Box Component
  card: {
    baseStyle: {
      bg: "white",
      borderRadius: "lg",
      borderWidth: "1px",
      borderColor: "gray.200",
      padding: 6,
    },
  },

  // Heading Component
  heading: {
    baseStyle: {
      fontWeight: "bold",
      color: "gray.900",
    },
    sizes: {
      sm: { fontSize: "lg" },
      md: { fontSize: "xl" },
      lg: { fontSize: "2xl" },
      xl: { fontSize: "3xl" },
    },
  },

  // Text Component
  text: {
    baseStyle: {
      color: "gray.900",
    },
    variants: {
      primary: { color: "gray.900" },
      secondary: { color: "gray.700" },
      muted: { color: "gray.600" },
      disabled: { color: "gray.400" },
    },
  },

  // Badge Component
  badge: {
    baseStyle: {
      borderRadius: "full",
      px: 3,
      py: 1,
      fontSize: "sm",
      fontWeight: "bold",
    },
  },

  // Spinner Component
  spinner: {
    defaultColor: "purple.500",
    sizes: {
      sm: "1rem",
      md: "2rem",
      lg: "3rem",
      xl: "4rem",
    },
  },

  // Table Component
  table: {
    header: {
      bg: "gray.50",
      fontWeight: "semibold",
      fontSize: "sm",
      color: "gray.700",
      borderBottomWidth: "1px",
      borderColor: "gray.200",
    },
    row: {
      borderBottomWidth: "1px",
      borderColor: "gray.200",
      color: "gray.900",
      hoverBg: "gray.50",
    },
  },

  // Sidebar/Navigation
  navigation: {
    inactive: {
      color: "gray.700",
      hoverBg: "gray.100",
    },
    active: {
      bg: "purple.50",
      color: "purple.600",
      fontWeight: "semibold",
    },
  },

  // Icon Button
  iconButton: {
    baseStyle: {
      borderRadius: "md",
      transition: "all 0.2s",
    },
    variants: {
      ghost: {
        color: "gray.700",
        hoverBg: "gray.100",
      },
      solid: {
        bg: "purple.600",
        color: "white",
        hoverBg: "purple.700",
      },
    },
  },
}

/**
 * Quick Customization Guide:
 *
 * 1. Button Sizes:
 *    - Change button.sizes values to adjust padding and height
 *
 * 2. Button Colors:
 *    - Defined in theme/index.ts under button.variants
 *
 * 3. Input Styles:
 *    - Modify input.baseStyle for default input appearance
 *    - Modify input.focusStyle for focus state
 *
 * 4. Card Styles:
 *    - Change card.baseStyle to update box/card appearance globally
 *
 * 5. Text Colors:
 *    - Use text.variants to define different text color schemes
 *
 * 6. Table Styles:
 *    - Modify table.header for table header appearance
 *    - Modify table.row for table row appearance
 *
 * 7. Navigation:
 *    - Change navigation.inactive for default nav item style
 *    - Change navigation.active for selected nav item style
 */
