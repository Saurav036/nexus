import { useState, useRef } from 'react'
import { Box, Button, VStack, Heading, Text, Flex, Icon } from '@chakra-ui/react'
import { FiUsers, FiArrowLeft } from 'react-icons/fi'
import { SignupLayout } from '../../components/signup/SignupLayout'
import { SignupCard } from '../../components/signup/SignupCard'
import { useSignupFlow } from '../../hooks/useSignupFlow'
import { useToast } from '../../hooks/useToast'
import { authApi, ApiError } from '../../services/authApi'
import { auth0Api } from '../../services/auth0Api'

const SignupOrgExists = () => {
  const { state, goToLogin, goToSignup } = useSignupFlow(['email', 'organization'])
  const email = state.email || ''
  const organization = state.organization

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const isMountedRef = useRef(true)
  const toast = useToast()

  const handleRegisterWithOrg = async () => {
    if (!organization?.id) {
      setError('Organization information is missing')
      return
    }

    if (!organization?.auth0Id) {
      setError('Organization Auth0 ID is missing')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Step 1: Create user in Auth0
      const auth0UserResponse = await auth0Api.createUser({
        email,
        name: email.split('@')[0], // Use email prefix as name
      })

      if (!isMountedRef.current) return

      // Step 2: Assign user to Auth0 organization
      const userId = (auth0UserResponse as any).data?.user_id || (auth0UserResponse as any).user_id
      await auth0Api.assignUserToOrg(organization.auth0Id, {
        members: [userId],
      })

      if (!isMountedRef.current) return

      // Step 3: Register with our backend
      const response = await authApi.registerWithOrg({
        email,
        organizationId: organization.id,
      })

      if (!isMountedRef.current) return

      if (response.success) {
        toast.showSuccess(
          'Account Created!',
          'Your account has been created and added to the organization. Redirecting to login...'
        )
        // Wait a moment for the toast to show, then redirect
        setTimeout(() => {
          goToLogin()
        }, 2000)
      } else {
        setError(response.message || 'Registration failed. Please try again.')
      }
    } catch (err) {
      if (!isMountedRef.current) return

      if (err instanceof ApiError) {
        setError(err.message || 'Unable to complete registration. Please try again.')
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again later.')
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }

  const handleContactAdmin = () => {
    toast.showInfo(
      'Contact Administrator',
      'Please reach out to your organization administrator to request access to your workspace.'
    )
  }

  return (
    <SignupLayout subtitle="Join your organization" error={error}>
      <SignupCard>
        <Box textAlign="center">
          <Flex justify="center" mb={4}>
            <Box bg="green.50" p={4} borderRadius="full">
              <Icon as={FiUsers} fontSize="3xl" color="green.500" aria-hidden="true" />
            </Box>
          </Flex>
          <Heading size="xl" mb={3} color="gray.900">
            Organization Found!
          </Heading>
          <Text color="gray.600" fontSize="md" mb={2}>
            We found an existing organization for your domain:
          </Text>
          <Text color="gray.900" fontSize="lg" fontWeight="bold">
            {organization?.displayName || organization?.name || 'Unknown Organization'}
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
            onClick={handleRegisterWithOrg}
            loading={loading}
            disabled={loading}
            _hover={{ bg: 'black', color: 'white', borderColor: 'black' }}
            transition="all 0.2s"
            aria-busy={loading}
            aria-label={loading ? 'Submitting your request' : 'Request to join organization'}
          >
            <VStack gap={0}>
              <Text fontWeight="bold">Join Organization</Text>
              <Text fontSize="xs" opacity={0.9}>
                Create account and join
              </Text>
            </VStack>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            width="full"
            h={14}
            fontSize="md"
            onClick={handleContactAdmin}
            disabled={loading}
            color="gray.600"
            _hover={{ bg: 'gray.100' }}
            transition="all 0.2s"
            aria-label="Get information about contacting your administrator"
          >
            <VStack gap={0}>
              <Text fontWeight="bold">Contact Administrator</Text>
              <Text fontSize="xs" color="gray.500">
                Get help from your admin
              </Text>
            </VStack>
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={goToSignup}
            disabled={loading}
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

export default SignupOrgExists
