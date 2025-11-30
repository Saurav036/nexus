import { RadioGroup as ChakraRadioGroup } from "@chakra-ui/react"
import * as React from "react"

export interface RadioGroupRootProps extends ChakraRadioGroup.RootProps {
  children: React.ReactNode
}

export interface RadioGroupItemProps extends ChakraRadioGroup.ItemProps {
  value: string
  children?: React.ReactNode
}

// RadioGroup namespace with all subcomponents
export const RadioGroup = {
  Root: React.forwardRef<HTMLDivElement, RadioGroupRootProps>(
    function RadioGroupRoot(props, ref) {
      return <ChakraRadioGroup.Root ref={ref} {...props} />
    },
  ),

  Item: React.forwardRef<HTMLDivElement, RadioGroupItemProps>(
    function RadioGroupItem(props, ref) {
      return <ChakraRadioGroup.Item ref={ref} {...props} />
    },
  ),

  ItemHiddenInput: ChakraRadioGroup.ItemHiddenInput,
  ItemIndicator: ChakraRadioGroup.ItemIndicator,
  ItemText: ChakraRadioGroup.ItemText,
}
