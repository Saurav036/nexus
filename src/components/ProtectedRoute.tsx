import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAuth0 } from '@auth0/auth0-react'
import { Box, Spinner, Flex } from '@chakra-ui/react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const { user } = useAuth0()

  if (isLoading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="gray.50">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check if email is verified
  if (user && user.email_verified === false) {
    console.log('⚠️ Email not verified, redirecting to verification page from protected route')
    return <Navigate to="/verify-email" replace />
  }

  return <>{children}</>
}
