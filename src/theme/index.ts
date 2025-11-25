import { createSystem, defaultConfig } from "@chakra-ui/react"
import { buttonRecipe } from "./button-theme"
import { inputRecipe, selectRecipe, textareaRecipe } from "./input-theme"

// Create custom system with component overrides
export const system = createSystem(defaultConfig, {
  theme: {
    recipes: {
      button: buttonRecipe,
      input: inputRecipe,
      select: selectRecipe,
      textarea: textareaRecipe,
    },
  },
  globalCss: {
    "html, body": {
      bg: "gray.50",
      color: "gray.900",
    },
    // Input and Select fields - force light styling
    "input, select, textarea": {
      bg: "white !important",
      color: "gray.900 !important",
      borderColor: "gray.300 !important",
    },
    // Select dropdown options
    "select option": {
      bg: "white !important",
      color: "gray.900 !important",
    },
    // Chakra UI Select component
    "[data-scope='select'][data-part='trigger']": {
      bg: "white",
      color: "gray.900",
      borderColor: "gray.300",
    },
    "[data-scope='select'][data-part='content']": {
      bg: "white",
      borderColor: "gray.200",
    },
    "[data-scope='select'][data-part='item']": {
      bg: "white",
      color: "gray.900",
      _hover: {
        bg: "gray.100",
      },
      _selected: {
        bg: "purple.50",
        color: "purple.900",
      },
    },
    // Custom scrollbar styling - lighter colors
    "::-webkit-scrollbar": {
      width: "12px",
      height: "12px",
    },
    "::-webkit-scrollbar-track": {
      bg: "gray.100", // Light gray background
      borderRadius: "md",
    },
    "::-webkit-scrollbar-thumb": {
      bg: "gray.300", // Light gray thumb
      borderRadius: "md",
      border: "2px solid",
      borderColor: "gray.100",
      _hover: {
        bg: "gray.400", // Slightly darker on hover
      },
    },
    // Firefox scrollbar
    "*": {
      scrollbarWidth: "thin",
      scrollbarColor: "var(--chakra-colors-gray-300) var(--chakra-colors-gray-100)",
    },
  },
})
