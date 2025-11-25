import { useState, useRef } from 'react'
import { Box, Button, Input, Heading, Text, Stack, Flex, Icon } from '@chakra-ui/react'
import { FiUsers, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import { SignupLayout } from '../../components/signup/SignupLayout'
import { SignupCard } from '../../components/signup/SignupCard'
import { useSignupFlow } from '../../hooks/useSignupFlow'
import { ApiError } from '../../services/authApi'
import { auth0Api } from '../../services/auth0Api'
import { validators, sanitizeInput } from '../../utils/validation'
import type { OrgFormData } from '../../types/auth'

const SignupCreateOrg = () => {
  const { state, goToSignup } = useSignupFlow(['email', 'domain'])
  const email = state.email || ''
  const initialDomain = state.domain || ''

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof OrgFormData, string>>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdOrgName, setCreatedOrgName] = useState('')
  const isMountedRef = useRef(true)

  const [orgData, setOrgData] = useState<OrgFormData>({
    name: '',
    displayName: '',
    domain: initialDomain,
    password: '',
  })

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof OrgFormData, string>> = {}

    const nameError = validators.orgName(orgData.name)
    if (nameError) errors.name = nameError

    const displayNameError = validators.displayName(orgData.displayName)
    if (displayNameError) errors.displayName = displayNameError

    const domainError = validators.domain(orgData.domain)
    if (domainError) errors.domain = domainError

    const passwordError = validators.password(orgData.password || '')
    if (passwordError) errors.password = passwordError

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(orgData.name),
      displayName: sanitizeInput(orgData.displayName),
      domain: sanitizeInput(orgData.domain),
      password: orgData.password || '',
    }

    setOrgData(sanitizedData)

    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Register user and organization in one go using the new register endpoint
      await auth0Api.register({
        orgName: sanitizedData.name,
        display_name: sanitizedData.displayName,
        orgDomain: sanitizedData.domain,
        userEmail: email,
        userPassword: sanitizedData.password,
      })

      if (!isMountedRef.current) return

      // Registration completed successfully, redirect to login
      setCreatedOrgName(sanitizedData.displayName)
      setShowSuccess(true)
    } catch (err) {
      if (!isMountedRef.current) return

      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError('An organization with this name or domain already exists.')
        } else {
          setError(err.message || 'Unable to create organization. Please try again.')
        }
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

  const handleInputChange = (field: keyof OrgFormData, value: string) => {
    setOrgData({ ...orgData, [field]: value })
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: undefined })
    }
    setError('')
  }

  const handleGoToLogin = () => {
    // Redirect to login page
    window.location.href = '/login'
  }

  if (showSuccess) {
    return (
      <SignupLayout subtitle="Success!">
        <SignupCard>
          <Box textAlign="center">
            <Flex justify="center" mb={4}>
              <Icon as={FiCheckCircle} color="green.500" boxSize={16} />
            </Flex>
            <Heading size="xl" mb={3} color="gray.900">Registration Successful!</Heading>
            <Text fontSize="lg" mb={2} color="gray.700">
              Your account and organization <strong>{createdOrgName}</strong> have been created successfully.
            </Text>
            <Text fontSize="md" color="gray.600" mb={6}>
              Please log in with your email and password to continue.
            </Text>
            <Stack gap={3}>
              <Button
                bg="white"
                color="black"
                variant="outline"
                borderColor="gray.300"
                size="lg"
                onClick={handleGoToLogin}
                fontSize="md"
                h={12}
                _hover={{ bg: 'black', color: 'white', borderColor: 'black' }}
                transition="all 0.2s"
              >
                Go to Login
              </Button>
            </Stack>
          </Box>
        </SignupCard>
      </SignupLayout>
    )
  }

  return (
    <SignupLayout subtitle="Complete your registration" error={error}>
      <SignupCard>
        <Box>
          <Flex align="center" gap={2} mb={2}>
            <Icon as={FiUsers} fontSize="xl" color="purple.500" aria-hidden="true" />
            <Heading size="xl" color="gray.900">Complete Registration</Heading>
          </Flex>
          <Text color="gray.600" fontSize="md">
            Set up your organization workspace and create your account. This will be your team's central
            hub for managing and distributing Tableau reports.
          </Text>
        </Box>

        <Box as="form" onSubmit={handleOrgSubmit}>
          <Stack gap={5}>
            <Box>
              <Text fontWeight="medium" mb={2} color="gray.700">
                Organization Name
              </Text>
              <Input
                placeholder="acme-corp"
                value={orgData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                size="lg"
                required
                disabled={loading}
                borderWidth={2}
                borderColor={fieldErrors.name ? 'red.500' : undefined}
                _focus={{
                  borderColor: fieldErrors.name ? 'red.500' : 'purple.500',
                  boxShadow: `0 0 0 1px var(--chakra-colors-${fieldErrors.name ? 'red' : 'purple'}-500)`
                }}
                aria-label="Organization name"
                aria-required="true"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? 'name-error name-help' : 'name-help'}
                maxLength={50}
              />
              {fieldErrors.name && (
                <Text id="name-error" color="red.500" fontSize="sm" mt={1} role="alert">
                  {fieldErrors.name}
                </Text>
              )}
              <Text id="name-help" fontSize="xs" color="gray.500" mt={1}>
                Used for URLs and identifiers (lowercase, no spaces)
              </Text>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2} color="gray.700">
                Display Name
              </Text>
              <Input
                placeholder="Acme Corporation"
                value={orgData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                size="lg"
                required
                disabled={loading}
                borderWidth={2}
                borderColor={fieldErrors.displayName ? 'red.500' : undefined}
                _focus={{
                  borderColor: fieldErrors.displayName ? 'red.500' : 'purple.500',
                  boxShadow: `0 0 0 1px var(--chakra-colors-${fieldErrors.displayName ? 'red' : 'purple'}-500)`
                }}
                aria-label="Organization display name"
                aria-required="true"
                aria-invalid={!!fieldErrors.displayName}
                aria-describedby={fieldErrors.displayName ? 'display-name-error display-name-help' : 'display-name-help'}
                maxLength={100}
              />
              {fieldErrors.displayName && (
                <Text id="display-name-error" color="red.500" fontSize="sm" mt={1} role="alert">
                  {fieldErrors.displayName}
                </Text>
              )}
              <Text id="display-name-help" fontSize="xs" color="gray.500" mt={1}>
                Your organization's full name
              </Text>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2} color="gray.700">
                Email Domain
              </Text>
              <Input
                placeholder="acme.com"
                value={orgData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                size="lg"
                required
                disabled={loading}
                borderWidth={2}
                borderColor={fieldErrors.domain ? 'red.500' : undefined}
                _focus={{
                  borderColor: fieldErrors.domain ? 'red.500' : 'purple.500',
                  boxShadow: `0 0 0 1px var(--chakra-colors-${fieldErrors.domain ? 'red' : 'purple'}-500)`
                }}
                aria-label="Email domain"
                aria-required="true"
                aria-invalid={!!fieldErrors.domain}
                aria-describedby={fieldErrors.domain ? 'domain-error domain-help' : 'domain-help'}
                maxLength={253}
              />
              {fieldErrors.domain && (
                <Text id="domain-error" color="red.500" fontSize="sm" mt={1} role="alert">
                  {fieldErrors.domain}
                </Text>
              )}
              <Text id="domain-help" fontSize="xs" color="gray.500" mt={1}>
                Used to automatically add team members with matching email domain
              </Text>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2} color="gray.700">
                Password
              </Text>
              <Input
                type="password"
                placeholder="Enter password"
                value={orgData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                size="lg"
                required
                disabled={loading}
                borderWidth={2}
                borderColor={fieldErrors.password ? 'red.500' : undefined}
                _focus={{
                  borderColor: fieldErrors.password ? 'red.500' : 'purple.500',
                  boxShadow: `0 0 0 1px var(--chakra-colors-${fieldErrors.password ? 'red' : 'purple'}-500)`
                }}
                aria-label="Password"
                aria-required="true"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error password-help' : 'password-help'}
                maxLength={128}
              />
              {fieldErrors.password && (
                <Text id="password-error" color="red.500" fontSize="sm" mt={1} role="alert">
                  {fieldErrors.password}
                </Text>
              )}
              <Text id="password-help" fontSize="xs" color="gray.500" mt={1}>
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </Text>
            </Box>

            <Stack gap={3} pt={2}>
              <Button
                type="submit"
                bg="white"
                color="black"
                variant="outline"
                borderColor="gray.300"
                size="lg"
                loading={loading}
                disabled={loading}
                fontSize="md"
                h={12}
                _hover={{ bg: 'black', color: 'white', borderColor: 'black' }}
                transition="all 0.2s"
                aria-busy={loading}
                aria-label={loading ? 'Completing registration' : 'Complete registration'}
              >
                Complete Registration
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={goToSignup}
                disabled={loading}
                color="gray.600"
                _hover={{ bg: 'gray.100' }}
                aria-label="Go back to start"
              >
                <Flex align="center" gap={2}>
                  <Icon as={FiArrowLeft} />
                  <Text>Back</Text>
                </Flex>
              </Button>
            </Stack>
          </Stack>
        </Box>
      </SignupCard>
    </SignupLayout>
  )
}

export default SignupCreateOrg
