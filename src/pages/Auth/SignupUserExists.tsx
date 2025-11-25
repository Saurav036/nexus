import { Box, Button, VStack, Heading, Text, Flex, Icon } from '@chakra-ui/react'
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi'
import { SignupLayout } from '../../components/signup/SignupLayout'
import { SignupCard } from '../../components/signup/SignupCard'
import { useSignupFlow } from '../../hooks/useSignupFlow'

const SignupUserExists = () => {
  const { state, goToLogin, goToSignup } = useSignupFlow(['email'])
  const email = state.email || ''

  return (
    <SignupLayout subtitle="Account already exists">
      <SignupCard>
        <Box textAlign="center">
          <Flex justify="center" mb={4}>
            <Box bg="red.50" p={4} borderRadius="full">
              <Icon as={FiAlertCircle} fontSize="3xl" color="red.500" aria-hidden="true" />
            </Box>
          </Flex>
          <Heading size="xl" mb={3} color="gray.900">
            Account Already Exists
          </Heading>
          <Text color="gray.600" fontSize="md">
            An account with <strong>{email}</strong> already exists in our system.
            Please log in to access your account.
          </Text>
        </Box>

        <VStack gap={3} pt={4}>
          <Button
            bg="white"
            color="black"
            variant="outline"
            borderColor="gray.300"
            size="lg"
            width="full"
            h={12}
            fontSize="md"
            onClick={goToLogin}
            _hover={{ bg: 'black', color: 'white', borderColor: 'black' }}
            transition="all 0.2s"
            aria-label="Go to login page"
          >
            Go to Login
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={goToSignup}
            color="gray.600"
            _hover={{ bg: 'gray.100' }}
            aria-label="Try a different email address"
          >
            <Flex align="center" gap={2}>
              <Icon as={FiArrowLeft} />
              <Text>Try Different Email</Text>
            </Flex>
          </Button>
        </VStack>
      </SignupCard>
    </SignupLayout>
  )
}

export default SignupUserExists
