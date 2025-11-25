import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Spinner, Flex, Text } from '@chakra-ui/react'
import { useAuth0 } from '@auth0/auth0-react'

const Callback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, error, user, appState } = useAuth0()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    if (errorParam) {
      console.error('URL Error:', errorParam, errorDescription)
      navigate('/login', { replace: true })
      return
    }

    if (error) {
      console.error('Auth0 Error:', error)
      navigate('/login', { replace: true })
      return
    }

    if (!isLoading) {
      if (isAuthenticated && user) {
        console.log('✅ User authenticated successfully!')

        // Check if we have a returnTo path in appState (for re-authentication flow)
        if (appState && appState.returnTo) {
          console.log('🔄 Redirecting back to:', appState.returnTo)
          setTimeout(() => {
            navigate(appState.returnTo, { replace: true })
          }, 1000)
          return
        }

        // Check if email is verified
        if (user.email_verified === false) {
          console.warn('⚠️ Email not verified, redirecting to verification page')
          setTimeout(() => {
            navigate('/verify-email', { replace: true })
          }, 1000)
          return
        }

        // Email is verified, proceed to dashboard
        setTimeout(() => {
          console.log('✅ Email verified, redirecting to dashboard...')
          navigate('/dashboard', { replace: true })
        }, 1000)
      } else if (!isLoading && !isAuthenticated) {
        console.warn('⚠️ User not authenticated after callback')
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 3000)
      }
    }
  }, [isAuthenticated, isLoading, error, user, navigate, location, appState])

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Flex direction="column" align="center" gap={4}>
        <Spinner size="xl" color="white" thickness="4px" />
        <Text color="white" fontSize="lg" fontWeight="medium">
          {isLoading ? 'Authenticating...' : 'Verifying...'}
        </Text>
      </Flex>
    </Box>
  )
}

export default Callback
