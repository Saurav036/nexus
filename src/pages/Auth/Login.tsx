import { useEffect, useState } from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
  Flex,
  Spinner,
} from '@chakra-ui/react'
import { FiLock, FiArrowRight } from 'react-icons/fi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, isLoading } = useAuth()
  const { loginWithRedirect } = useAuth0()
  const [invitationHandled, setInvitationHandled] = useState(false)

  // Handle invitation login on mount (runs first)
  useEffect(() => {
    // Try to get params from both searchParams and window.location.search as fallback
    let invitation = searchParams.get('invitation')
    let organization = searchParams.get('organization')
    let organizationName = searchParams.get('organization_name')

    // Fallback: parse window.location.search directly
    if (!invitation || !organization) {
      const urlParams = new URLSearchParams(window.location.search)
      invitation = invitation || urlParams.get('invitation')
      organization = organization || urlParams.get('organization')
      organizationName = organizationName || urlParams.get('organization_name')
      console.log('⚠️ Using fallback URL params from window.location.search')
    }

    console.log('🔍 Checking URL params:', { invitation, organization, organizationName })
    console.log('🔍 Current URL:', window.location.href)
    console.log('🔍 Client ID from env:', import.meta.env.VITE_AUTH0_SPA_CLIENT_ID)

    // If invitation parameters are present, redirect to Auth0 with them
    if (invitation && organization && !invitationHandled && !isAuthenticated) {
      console.log('🔗 Invitation login detected - redirecting to Auth0...')
      setInvitationHandled(true)

      // Construct Auth0 URL manually
      const auth0Domain = 'sproutlogix-dev.us.auth0.com'
      const clientId = import.meta.env.VITE_AUTH0_SPA_CLIENT_ID
      const redirectUri = `${window.location.origin}/callback`

      console.log('🔑 Using client_id:', clientId)
      console.log('🔙 Redirect URI:', redirectUri)

      const params = new URLSearchParams({
        invitation: invitation,
        organization: organization,
        ...(organizationName && { organization_name: organizationName }),
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: 'openid profile email',
      })

      const auth0Url = `https://${auth0Domain}/authorize?${params.toString()}`
      console.log('🚀 Redirecting to:', auth0Url)

      // Use setTimeout to ensure state update completes before redirect
      setTimeout(() => {
        console.log('🎯 Executing redirect now...')
        window.location.href = auth0Url
      }, 100)
    }
  }, [searchParams, invitationHandled, isAuthenticated])

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !invitationHandled) {
      console.log('✅ Already authenticated - redirecting to dashboard')
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate, invitationHandled])

  const handleLogin = () => {
    loginWithRedirect()
  }

  // Show loading spinner if processing invitation or auth is loading
  if (isLoading || invitationHandled) {
    return (
      <Box minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Spinner size="xl" color="white" />
          {invitationHandled && (
            <Text color="white" fontSize="lg">
              Processing invitation...
            </Text>
          )}
        </VStack>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box maxW="450px" w="full" bg="white" p={8} borderRadius="lg" boxShadow="2xl">
        <VStack gap={6} align="stretch">
          <Box textAlign="center">
            <Flex justify="center" mb={4}>
              <Box bg="purple.50" p={4} borderRadius="full">
                <Icon as={FiLock} fontSize="3xl" color="purple.500" />
              </Box>
            </Flex>
            <Heading size="xl" mb={2} color="gray.900">
              Welcome Back
            </Heading>
            <Text color="gray.600" fontSize="md">
              Sign in to your account using Auth0
            </Text>
          </Box>

          <VStack gap={4}>
            <Button
              onClick={handleLogin}
              bg="white"
              color="black"
              variant="outline"
              borderColor="gray.300"
              size="lg"
              h={14}
              w="full"
              fontSize="md"
              _hover={{ bg: 'black', color: 'white', borderColor: 'black' }}
              transition="all 0.2s"
            >
              <Flex align="center" gap={2}>
                <Icon as={FiLock} />
                <Text fontWeight="bold">Sign In with Auth0</Text>
                <Icon as={FiArrowRight} />
              </Flex>
            </Button>

            <Text color="gray.500" fontSize="xs" textAlign="center">
              Secure authentication powered by Auth0
            </Text>
          </VStack>

          <Box textAlign="center" pt={4} borderTopWidth={1} borderColor="gray.200">
            <Text color="gray.600" fontSize="sm">
              Don't have an account?{' '}
              <Button
                variant="ghost"
                colorScheme="purple"
                onClick={() => navigate('/signup')}
                fontSize="sm"
                p={0}
                h="auto"
                minW="auto"
              >
                Sign up
              </Button>
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}

export default Login
