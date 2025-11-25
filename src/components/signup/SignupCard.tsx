import { Card, VStack } from '@chakra-ui/react'

interface SignupCardProps {
  children: React.ReactNode
}

export const SignupCard = ({ children }: SignupCardProps) => {
  return (
    <Card.Root
      bg="white"
      boxShadow="2xl"
      borderRadius="2xl"
      overflow="hidden"
      width="full"
      maxW="700px"
      color='gray.950'
    >
      <Card.Body p={10}>
        <VStack gap={6} align="stretch">
          {children}
        </VStack>
      </Card.Body>
    </Card.Root>
  )
}
