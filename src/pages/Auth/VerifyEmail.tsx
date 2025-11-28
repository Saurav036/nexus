import { useState, useEffect } from 'react'
import { Box, Button, Flex, Heading, Text, VStack, Icon } from '@chakra-ui/react'
import { FiMail, FiAlertCircle } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

const VerifyEmail = () => {
  const navigate = useNavigate()
  const { user, logout, getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0()
  const [isChecking, setIsChecking] = useState(false)

  console.log('🔍 VerifyEmail Component State:', {
    isAuthenticated,
    user,
    email_verified: user?.email_verified,
    isChecking
  })

  // If user somehow gets here but is not authenticated, redirect to login
  useEffect(() => {
    console.log('🔍 Auth check effect - isAuthenticated:', isAuthenticated)
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to login')
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  // If email is verified, redirect to dashboard
  useEffect(() => {
    console.log('🔍 Email verification check effect - user:', user, 'email_verified:', user?.email_verified)
    if (user && user.email_verified === true) {
      console.log('✅ Email verified, redirecting to dashboard')
      navigate('/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
  }

  const handleCheckAgain = async () => {
    console.log('🔄 Check Again button clicked')
    setIsChecking(true)
    console.log('🔄 isChecking set to true')

    try {
      // Clear Auth0 SPA cache (but preserve our access token)
      console.log('🔄 Clearing Auth0 SPA cache...')
      const accessToken = localStorage.getItem('auth0_access_token')
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        // Clear Auth0 internal cache but not our stored access token
        if (key && key.startsWith('@@auth0spajs@@')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
      console.log(`✅ Cleared ${keysToRemove.length} Auth0 cache entries`)

      // Restore access token if it existed
      if (accessToken) {
        localStorage.setItem('auth0_access_token', accessToken)
      }

      // Re-authenticate to get fresh user data
      console.log('🔄 Re-authenticating to fetch fresh user data...')
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.origin + '/callback',
          screen_hint: 'signup' // This helps Auth0 understand we're checking verification
        },
        appState: {
          returnTo: '/verify-email'
        }
      })
    } catch (error) {
      console.error('❌ Error during re-authentication:', error)
      setIsChecking(false)
    }
  }

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box maxW="500px" w="full" bg="white" p={8} borderRadius="lg" boxShadow="2xl">
        <VStack gap={6} align="stretch">
          <Box textAlign="center">
            <Flex justify="center" mb={4}>
              <Box bg="orange.50" p={4} borderRadius="full">
                <Icon as={FiAlertCircle} fontSize="3xl" color="orange.500" />
              </Box>
            </Flex>
            <Heading size="xl" mb={3} color="gray.900">
              Email Verification Required
            </Heading>
            <Text color="gray.600" fontSize="md" mb={2}>
              Please verify your email address to continue.
            </Text>
            {user?.email && (
              <Text color="gray.700" fontSize="md" fontWeight="semibold" mb={4}>
                {user.email}
              </Text>
            )}
          </Box>

          <Box bg="blue.50" p={4} borderRadius="md" borderLeftWidth={4} borderLeftColor="blue.500">
            <Flex gap={3} align="start">
              <Icon as={FiMail} color="blue.500" boxSize={5} mt={0.5} />
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={1} color="blue.900">
                  Check Your Inbox
                </Text>
                <Text fontSize="sm" color="blue.800">
                  We've sent a verification email to your address. Click the link in the email to verify your account.
                </Text>
              </Box>
            </Flex>
          </Box>

          <VStack gap={3}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Didn't receive the email? Check your spam folder or request a new verification email from Auth0.
            </Text>

            <Button
              onClick={handleCheckAgain}
              bg="white"
              color="black"
              variant="outline"
              borderColor="gray.300"
              size="lg"
              w="full"
              loading={isChecking}
              disabled={isChecking}
              _hover={{ bg: 'black', color: 'white', borderColor: 'black' }}
            >
              {isChecking ? 'Checking...' : "I've Verified My Email"}
            </Button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="md"
              color="gray.600"
              _hover={{ bg: 'gray.100' }}
            >
              Sign Out
            </Button>
          </VStack>

          <Box pt={4} borderTopWidth={1} borderColor="gray.200">
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Having trouble? Contact support for assistance.
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}

export default VerifyEmail
