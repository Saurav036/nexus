import { Box, Button, VStack, Heading, Text, Flex, Icon } from '@chakra-ui/react'
import { FiUsers, FiArrowLeft } from 'react-icons/fi'
import { SignupLayout } from '../../components/signup/SignupLayout'
import { SignupCard } from '../../components/signup/SignupCard'
import { useSignupFlow } from '../../hooks/useSignupFlow'

const SignupPublicDomain = () => {
  const { state, goToCreateOrg, goToSignup } = useSignupFlow(['email', 'domain'])
  const email = state.email || ''
  const domain = state.domain || ''

  const handleContinue = () => {
    goToCreateOrg(email, domain)
  }

  return (
    <SignupLayout subtitle="Set up your workspace">
      <SignupCard>
        <Box textAlign="center">
          <Flex justify="center" mb={4}>
            <Box bg="blue.50" p={4} borderRadius="full">
              <Icon fontSize="3xl" color="blue.500" aria-hidden="true">
                <FiUsers />
              </Icon>
            </Box>
          </Flex>
          <Heading size="xl" mb={3} color="gray.900">
            Create Your Organization
          </Heading>
          <Text color="gray.600" fontSize="md">
            You're using a public email domain ({domain}).
            You can create a new organization and invite your team members.
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
            h={14}
            fontSize="md"
            onClick={handleContinue}
            _hover={{ bg: 'black', color: 'white', borderColor: 'black' }}
            transition="all 0.2s"
            aria-label="Continue to create organization"
          >
            <VStack gap={0}>
              <Text fontWeight="bold">Continue with Signup</Text>
              <Text fontSize="xs" opacity={0.9}>
                Create a new organization
              </Text>
            </VStack>
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={goToSignup}
            color="gray.600"
            _hover={{ bg: 'gray.100' }}
            aria-label="Use a different email address"
          >
            <Flex align="center" gap={2}>
              <Icon as={FiArrowLeft} />
              <Text>Use Different Email</Text>
            </Flex>
          </Button>
        </VStack>
      </SignupCard>
    </SignupLayout>
  )
}

export default SignupPublicDomain
