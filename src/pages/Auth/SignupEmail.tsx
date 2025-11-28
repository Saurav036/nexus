import { useState, useRef, useCallback, useEffect } from 'react'
import { Box, Button, Input, Heading, Text, Stack, Flex, Icon, HStack, Spinner, VStack } from '@chakra-ui/react'
import { FiMail, FiAlertCircle } from 'react-icons/fi'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { SignupLayout } from '../../components/signup/SignupLayout'
import { SignupCard } from '../../components/signup/SignupCard'
import { useSignupFlow } from '../../hooks/useSignupFlow'
import { authApi } from '../../services/authApi'
import { validators, sanitizeInput, extractDomain, isPublicDomain } from '../../utils/validation'
import { PUBLIC_EMAIL_DOMAINS } from '../../config/constants'

const SignupEmail = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [showUserNotFound, setShowUserNotFound] = useState(false)
  const [userNotFoundEmail, setUserNotFoundEmail] = useState('')
  const [userNotFoundDomain, setUserNotFoundDomain] = useState<string | null>(null)
  const [invitationHandled, setInvitationHandled] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const isMountedRef = useRef(true)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loginWithRedirect } = useAuth0()

  // Log immediately on component mount
  console.log('📍 SignupEmail component mounted')
  console.log('📍 Current URL:', window.location.href)
  console.log('📍 window.location.search:', window.location.search)
  console.log('📍 Search params:', searchParams.toString())
  console.log('📍 Client ID from env:', import.meta.env.VITE_AUTH0_SPA_CLIENT_ID)

  const {
    goToUserExists,
    goToPublicDomain,
    goToOrgExists,
    goToCreateOrg,
  } = useSignupFlow()

  // Handle invitation signup on mount
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

    console.log('🔍 Checking URL params on signup:', { invitation, organization, organizationName })
    console.log('🔍 invitationHandled state:', invitationHandled)

    // If invitation parameters are present, redirect to Auth0 with them
    if (invitation && organization && !invitationHandled) {
      console.log('🔗 Invitation signup detected - redirecting to Auth0...')
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
        screen_hint: 'signup',
      })

      const auth0Url = `https://${auth0Domain}/authorize?${params.toString()}`
      console.log('🚀 Redirecting to:', auth0Url)

      // Use setTimeout to ensure state update completes before redirect
      setTimeout(() => {
        console.log('🎯 Executing redirect now...')
        window.location.href = auth0Url
      }, 100)
    }
  }, [searchParams, invitationHandled])

  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldError('')
    setShowUserNotFound(false)

    // Sanitize and validate email
    const sanitizedEmail = sanitizeInput(email)
    const validationError = validators.email(sanitizedEmail)
    const domain = extractDomain(sanitizedEmail)
    if (validationError) {
      setFieldError(validationError)
      return
    }

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setLoading(true)

    try {
      // Step 1: Check if user with same email already exists
      await authApi.checkEmail(
        sanitizedEmail,
        abortControllerRef.current.signal
      )

      if (!isMountedRef.current) return

      // If we reach here, user exists (API didn't throw error)
      // Redirect to login page instead
      navigate('/login', { state: { email: sanitizedEmail } })
      return
    } catch (err) {
      // User doesn't exist (API threw error)
      if (!isMountedRef.current) return

      if (err instanceof Error && err.message === 'Request was cancelled') {
        return
      }

      // Extract domain for further checks
      if (!domain) {
        setError('Invalid email format')
        return
      }

      // Check if email domain is public
      if (isPublicDomain(domain, PUBLIC_EMAIL_DOMAINS)) {
        goToPublicDomain(sanitizedEmail, domain)
        return
      }

      // User doesn't exist, now check if organization exists
      try {
        const orgData:any = await authApi.checkOrganization(
          domain,
          abortControllerRef.current?.signal
        )

        if (!isMountedRef.current) return

        if (orgData.data.exists && orgData.data.organization) {
          // Organization exists, user should join it
          goToOrgExists(sanitizedEmail, orgData.data.organization)
        } else {
          // No organization exists, show option to create new org
          setShowUserNotFound(true)
          setUserNotFoundEmail(sanitizedEmail)
          setUserNotFoundDomain(domain)
        }
      } catch (orgErr) {
        if (!isMountedRef.current) return

        // If org check fails, show option to create new org
        setShowUserNotFound(true)
        setUserNotFoundEmail(sanitizedEmail)
        setUserNotFoundDomain(domain)
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [email, goToUserExists, goToPublicDomain, goToOrgExists, goToCreateOrg])

  const handleCreateOrgYes = useCallback(() => {
    if (userNotFoundDomain && userNotFoundEmail) {
      goToCreateOrg(userNotFoundEmail, userNotFoundDomain)
    }
  }, [userNotFoundEmail, userNotFoundDomain, goToCreateOrg])

  const handleCreateOrgNo = useCallback(() => {
    setShowUserNotFound(false)
    setUserNotFoundEmail('')
    setUserNotFoundDomain(null)
    setEmail('')
  }, [])

  // Show loading spinner if processing invitation
  if (invitationHandled) {
    return (
      <Box minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Spinner size="xl" color="white" />
          <Text color="white" fontSize="lg">
            Processing invitation...
          </Text>
        </VStack>
      </Box>
    )
  }

  return (
    <SignupLayout subtitle="Powerful analytics and reporting at your fingertips" error={error}>
      <SignupCard>
        <Box>
          <Flex align="center" gap={2} mb={2}>
            <Icon as={FiMail} fontSize="xl" color="blue.500" aria-hidden="true" />
            <Heading size="xl" color='gray-900'>Get Started</Heading>
          </Flex>
          <Text color="gray.600" fontSize="md">
            Enter your email address to begin your journey with Nexus.
            We'll verify your account and get you set up in no time.
          </Text>
        </Box>

        <Box as="form" onSubmit={handleEmailSubmit}>
          <Stack gap={4}>
            <Box>
              <Text fontWeight="medium" mb={2} color="gray.700">
                Email Address
              </Text>
              <Input

                placeholder="you@company.com"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setFieldError('')
                  setError('')
                  setShowUserNotFound(false)
                }}
                size="lg"
                required
                disabled={loading}
                borderWidth={2}
                borderColor={fieldError ? 'red.500' : undefined}
                _focus={{ borderColor: fieldError ? 'red.500' : 'purple.500', boxShadow: `0 0 0 1px var(--chakra-colors-${fieldError ? 'red' : 'purple'}-500)` }}
                aria-label="Email address"
                aria-required="true"
                aria-invalid={!!fieldError}
                aria-describedby={fieldError ? 'email-error' : undefined}
                css={{
                  color: 'var(--chakra-colors-gray-900)',
                  '&::placeholder': { color: 'var(--chakra-colors-gray-400)' }
                }}
                maxLength={254}
              />
              {fieldError && (
                <Text id="email-error" color="red.500" fontSize="sm" mt={1} role="alert">
                  {fieldError}
                </Text>
              )}
            </Box>

            {showUserNotFound && (
              <Box
                p={4}
                borderWidth={1}
                borderLeftWidth={4}
                borderLeftColor="orange.500"
                borderRadius="md"
                bg="orange.50"
                borderColor="orange.200"
              >
                <Flex gap={3} align="start">
                  <Icon as={FiAlertCircle} color="orange.500" boxSize={5} mt={0.5} />
                  <Box flex="1">
                    <Text fontSize="md" fontWeight="semibold" mb={1} color="orange.900">
                      User Not Found
                    </Text>
                    <Text fontSize="sm" mb={3} color="orange.800">
                      No account exists for <strong>{userNotFoundEmail}</strong>.
                      Would you like to create a new organization?
                    </Text>
                    <HStack gap={3}>
                      <Button
                        size="sm"
                        bg="white"
                        color="black"
                        variant="outline"
                        borderColor="gray.300"
                        onClick={handleCreateOrgYes}
                        _hover={{ bg: 'black', color: 'white', borderColor: 'black' }}
                      >
                        Yes, Create Organization
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCreateOrgNo}
                      >
                        No, Try Another Email
                      </Button>
                    </HStack>
                  </Box>
                </Flex>
              </Box>
            )}

            <Button
              type="submit"
              bg="white"
              color="black"
              size="lg"
              variant="outline"
              borderColor="gray.300"
              loading={loading}
              disabled={loading || !email || showUserNotFound}
              fontSize="md"
              h={12}
              _hover={{ bg: 'black', color: 'white', borderColor: 'black' }}
              transition="all 0.2s"
              aria-busy={loading}
              aria-label={loading ? 'Verifying your email' : 'Continue'}
            >
              Continue
            </Button>
          </Stack>
        </Box>

        <Box pt={4} borderTopWidth={1} borderColor="gray.200">
          <Text fontSize="sm" color="gray.500" textAlign="center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </Box>
      </SignupCard>
    </SignupLayout>
  )
}

export default SignupEmail












