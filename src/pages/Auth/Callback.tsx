import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Box, Spinner, Flex, Text } from '@chakra-ui/react'
import { useAuth0 } from '@auth0/auth0-react'
import { usersApi } from '../../services/api'

const Callback = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading, error, user, getIdTokenClaims } = useAuth0()
  const appState = (useAuth0() as any).appState
  const [savingUser, setSavingUser] = useState(false)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    const invitation = searchParams.get('invitation')
    const organization = searchParams.get('organization')

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

        // Check if this is an invitation flow
        if (invitation && organization) {
          console.log('🎫 Invitation detected:', { invitation, organization })
          saveInvitedUser(user, organization)
          return
        }

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

  const saveInvitedUser = async (user: any, organizationId: string) => {
    try {
      setSavingUser(true)
      console.log('💾 Saving invited user to database...')

      // Get ID token claims to extract role
      const idTokenClaims = await getIdTokenClaims()
      const role = (idTokenClaims as any)?.role || (idTokenClaims as any)?.['https://odyssey.com/role'] || 'MEMBER'

      // Check if user already exists
      try {
        const existingUser = await usersApi.getByAuth0Id(user.sub)
        console.log('✅ User already exists in database:', existingUser)
        // User exists, redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard', { replace: true })
        }, 1000)
        return
      } catch (error) {
        console.log('📝 User not found, creating new user...')
      }

      // Save user to database
      await usersApi.inviteUser({
        orgAuth0Id: organizationId,
        userEmail: user.email,
        userAuth0Id: user.sub,
        userRole: role,
      })

      console.log('✅ User saved successfully!')

      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1000)
    } catch (error) {
      console.error('❌ Error saving invited user:', error)
      // Still redirect to dashboard even if save fails
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 1000)
    } finally {
      setSavingUser(false)
    }
  }

  return (
    <Box minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Flex direction="column" align="center" gap={4}>
        <Spinner size="xl" color="white" borderWidth="4px" />
        <Text color="white" fontSize="lg" fontWeight="medium">
          {savingUser ? 'Setting up your account...' : isLoading ? 'Authenticating...' : 'Verifying...'}
        </Text>
      </Flex>
    </Box>
  )
}

export default Callback
