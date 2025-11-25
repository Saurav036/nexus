import { defineRecipe } from "@chakra-ui/react"

// Override button recipe to make all solid buttons black
export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: "semibold",
    borderRadius: "md",
    transition: "all 0.2s",
  },
  variants: {
    variant: {
      // Solid variant - black background for all colors
      solid: {
        bg: "black",
        color: "white",
        _hover: {
          bg: "gray.800",
        },
        _active: {
          bg: "gray.900",
        },
      },
      // Outline variant
      outline: {
        borderWidth: "1px",
        borderColor: "gray.300",
        color: "gray.700",
        _hover: {
          bg: "gray.100",
        },
      },
      // Ghost variant
      ghost: {
        color: "gray.700",
        _hover: {
          bg: "gray.100",
        },
      },
    },
  },
  defaultVariants: {
    variant: "solid",
  },
})
