import { defineRecipe } from "@chakra-ui/react"

// Input field styling
export const inputRecipe = defineRecipe({
  base: {
    width: "100%",
    minWidth: 0,
    outline: 0,
    position: "relative",
    appearance: "none",
    transitionProperty: "common",
    transitionDuration: "normal",
    bg: "white",
    color: "gray.900",
    borderColor: "gray.300",
    borderWidth: "1px",
    borderRadius: "md",
    _hover: {
      borderColor: "gray.400",
    },
    _focus: {
      borderColor: "purple.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
    },
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
  variants: {
    size: {
      sm: {
        fontSize: "sm",
        px: 3,
        py: 2,
        height: 8,
      },
      md: {
        fontSize: "md",
        px: 4,
        py: 2,
        height: 10,
      },
      lg: {
        fontSize: "lg",
        px: 4,
        py: 3,
        height: 12,
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})

// Select/Dropdown styling
export const selectRecipe = defineRecipe({
  base: {
    width: "100%",
    minWidth: 0,
    outline: 0,
    position: "relative",
    appearance: "none",
    transitionProperty: "common",
    transitionDuration: "normal",
    bg: "white",
    color: "gray.900",
    borderColor: "gray.300",
    borderWidth: "1px",
    borderRadius: "md",
    paddingEnd: 8,
    _hover: {
      borderColor: "gray.400",
    },
    _focus: {
      borderColor: "purple.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
    },
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
  variants: {
    size: {
      sm: {
        fontSize: "sm",
        px: 3,
        py: 2,
        height: 8,
      },
      md: {
        fontSize: "md",
        px: 4,
        py: 2,
        height: 10,
      },
      lg: {
        fontSize: "lg",
        px: 4,
        py: 3,
        height: 12,
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})

// Textarea styling
export const textareaRecipe = defineRecipe({
  base: {
    width: "100%",
    minWidth: 0,
    outline: 0,
    position: "relative",
    appearance: "none",
    transitionProperty: "common",
    transitionDuration: "normal",
    bg: "white",
    color: "gray.900",
    borderColor: "gray.300",
    borderWidth: "1px",
    borderRadius: "md",
    _hover: {
      borderColor: "gray.400",
    },
    _focus: {
      borderColor: "purple.500",
      boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
    },
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
  variants: {
    size: {
      sm: {
        fontSize: "sm",
        px: 3,
        py: 2,
      },
      md: {
        fontSize: "md",
        px: 4,
        py: 2,
      },
      lg: {
        fontSize: "lg",
        px: 4,
        py: 3,
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
})
