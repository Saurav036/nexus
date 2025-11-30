import { type ReactNode } from 'react'
import { Box, Flex, Text, VStack, Icon, Button } from '@chakra-ui/react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FiHome,
  FiUsers,
  FiDatabase,
  FiFileText,
  FiCreditCard,
  FiKey,
  FiLink,
  FiSettings,
  FiLogOut
} from 'react-icons/fi'
import { useAuth } from '../../contexts/AuthContext'
import { toaster } from '../ui/toaster'

interface DashboardLayoutProps {
  children: ReactNode
}

interface NavItem {
  label: string
  path: string
  icon: any
  allowedRoles?: ('ADMIN' | 'MEMBER')[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: FiHome, allowedRoles: ['ADMIN', 'MEMBER'] },
  { label: 'Users', path: '/dashboard/users', icon: FiUsers, allowedRoles: ['ADMIN'] },
  // { label: 'Organizations', path: '/dashboard/organizations', icon: FiDatabase, allowedRoles: ['ADMIN'] },
  { label: 'Connections', path: '/dashboard/connections', icon: FiLink, allowedRoles: ['ADMIN'] },
  // { label: 'Credentials', path: '/dashboard/credentials', icon: FiKey },
  { label: 'Reports', path: '/dashboard/reports', icon: FiFileText, allowedRoles: ['ADMIN', 'MEMBER'] },
  { label: 'Billings', path: '/dashboard/billings', icon: FiCreditCard, allowedRoles: ['ADMIN'] },
  // { label: 'Settings', path: '/dashboard/settings', icon: FiSettings },
]

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  const handleLogout = () => {
    logout()
    toaster.create({
      title: 'Logged out successfully',
      type: 'success',
      duration: 2000,
    })
    navigate('/login')
  }

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box
        w="250px"
        bg="white"
        borderRightWidth={1}
        borderColor="gray.200"
        overflowY="auto"
      >
        {/* Logo/Brand */}
        <Box p={6} borderBottomWidth={1} borderColor="gray.200">
          <Text fontSize="xl" fontWeight="bold">
            <Text as="span" color="black">Nexus</Text>
            {' '}
            <Text as="span" color="gray.500" fontWeight="normal">for Tableau</Text>
          </Text>
        </Box>

        {/* Navigation */}
        <VStack align="stretch" gap={1} p={4}>
          {navItems.map((item) => {
            // Filter navigation items based on user role
            if (item.allowedRoles && user?.role && !item.allowedRoles.includes(user.role)) {
              return null
            }

            const isActive = location.pathname === item.path ||
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path))

            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                <Flex
                  align="center"
                  gap={3}
                  p={3}
                  borderRadius="md"
                  bg={isActive ? 'purple.50' : 'transparent'}
                  color={isActive ? 'purple.600' : 'gray.700'}
                  fontWeight={isActive ? 'semibold' : 'normal'}
                  _hover={{ bg: isActive ? 'purple.50' : 'gray.100' }}
                  transition="all 0.2s"
                  cursor="pointer"
                >
                  <Icon as={item.icon} boxSize={5} />
                  <Text fontSize="sm">{item.label}</Text>
                </Flex>
              </Link>
            )
          })}
        </VStack>

        {/* Logout Button */}
        <Box p={4} mt="auto" borderTopWidth={1} borderColor="gray.200">
          <Button
            variant="ghost"
            width="full"
            justifyContent="flex-start"
            onClick={handleLogout}
            color="gray.700"
            _hover={{ bg: 'red.50', color: 'red.600' }}
          >
            <Icon as={FiLogOut} mr={2} />
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box flex={1} overflowY="auto">
        <Box maxW="1400px" mx="auto" p={8}>
          {children}
        </Box>
      </Box>
    </Flex>
  )
}
