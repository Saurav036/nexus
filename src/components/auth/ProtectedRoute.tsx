import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('ADMIN' | 'MEMBER')[]
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null // Or a loading spinner
  }

  // If no specific roles are required, allow access
  if (!allowedRoles) {
    return <>{children}</>
  }

  // Check if user has the required role
  if (user?.role && allowedRoles.includes(user.role)) {
    return <>{children}</>
  }

  // Redirect to dashboard if user doesn't have permission
  return <Navigate to="/dashboard" replace />
}
