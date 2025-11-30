import { Box, Container, VStack, Heading, Text, Flex, Icon, Alert } from '@chakra-ui/react'
import { FiCheckCircle } from 'react-icons/fi'
import { UI_CONFIG } from '../../config/constants'

interface SignupLayoutProps {
  children: React.ReactNode
  subtitle: string
  error?: string
}

export const SignupLayout = ({ children, subtitle, error }: SignupLayoutProps) => {
  return (
    <Box minH="100vh" bg="gray.50" py={12} px={4}>
      <Container maxW="container.md">
        <VStack gap={8} align="center">
          {/* Header */}
          <Box textAlign="center" >
            <Flex justify="center" mb={4}>
              <Box
                bg="black"
                p={3}
                borderRadius="xl"
                boxShadow="xl"
              >
                <Icon fontSize="3xl" color="white">
                  <FiCheckCircle />
                </Icon>
              </Box>
            </Flex>
            <Heading size="3xl" mb={3} fontWeight="bold" color="gray.900">
              {UI_CONFIG.APP_NAME}
            </Heading>
            <Text fontSize="lg" color="gray.600">
              {subtitle}
            </Text>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert.Root status="error" borderRadius="lg" width="full" maxW="700px" role="alert" aria-live="assertive">
              <Alert.Indicator />
              <Alert.Description>{error}</Alert.Description>
            </Alert.Root>
          )}

          {/* Main Content */}
          {children}

          {/* Footer */}
          <Text textAlign="center" color="gray.600" fontSize="sm">
            Need help? Contact us at {UI_CONFIG.SUPPORT_EMAIL}
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}
