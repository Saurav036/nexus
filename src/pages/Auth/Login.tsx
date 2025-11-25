import { useEffect } from 'react'
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
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading } = useAuth()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleLogin = () => {
    login()
  }

  if (isLoading) {
    return (
      <Box minH="100vh" bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="white" />
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
