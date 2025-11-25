import { useState, useEffect } from 'react'
import { Box, Heading, SimpleGrid, Icon, Text, Flex, VStack, Code, Button, Badge } from '@chakra-ui/react'
import { FiUsers, FiDatabase, FiFileText, FiLink, FiCopy, FiShield } from 'react-icons/fi'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { useAuth } from '../../contexts/AuthContext'
import { toaster } from '../../components/ui/toaster'
import { usersApi, ApiError } from '../../services/api'
import type { User as UserType } from '../../types/api'

const Dashboard = () => {
  const { user, accessToken } = useAuth()
  const [userData, setUserData] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user data with organization info
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.auth0Id) {
        try {
          setLoading(true)
          const response = await usersApi.getByAuth0Id(user.auth0Id)
          const fetchedUserData = response.data || response.result
          setUserData(fetchedUserData)
        } catch (error) {
          console.error('Error fetching user data:', error)
          toaster.create({
            title: 'Error loading user data',
            description: error instanceof ApiError ? error.message : 'Failed to load user data',
            type: 'error',
            duration: 5000,
          })
        } finally {
          setLoading(false)
        }
      }
    }

    fetchUserData()
  }, [user])

  // Get user's role and organization
  const userRole = userData?.UserOrgMaps?.[0]?.role
  const userOrg = userData?.UserOrgMaps?.[0]?.org
  const isAdmin = userRole === 'ADMIN'

  // TODO: Fetch actual stats from API
  const stats = [
    { label: 'Total Users', value: '0', icon: FiUsers, color: 'blue' },
    { label: 'Organizations', value: '0', icon: FiDatabase, color: 'purple' },
    { label: 'Active Reports', value: '0', icon: FiFileText, color: 'green' },
    { label: 'Connections', value: '0', icon: FiLink, color: 'orange' },
  ]

  const handleCopyToken = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken)
      toaster.create({
        title: 'Copied!',
        description: 'Access token copied to clipboard',
        type: 'success',
        duration: 2000,
      })
    }
  }

  return (
    <DashboardLayout>
      <Box>
        <Heading mb={6}>Dashboard</Heading>

        {/* Display User Info and Access Token */}
        {user && accessToken && (
          <Box mb={6} bg="white" p={6} borderRadius="lg" borderWidth={1} borderColor="gray.200">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Welcome, {user.userEmail}!</Heading>
              {userRole && (
                <Badge
                  colorScheme={isAdmin ? 'purple' : 'blue'}
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="bold"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Icon as={FiShield} />
                  {isAdmin ? 'ADMIN' : 'MEMBER'}
                </Badge>
              )}
            </Flex>
            <VStack align="stretch" gap={4}>
              <Box>
                {/* <Text fontSize="sm" fontWeight="medium" color="black" mb={2}>
                  User ID: <Text as="span" fontWeight="normal">{user.userId}</Text>
                </Text> */}
                {/* <Text fontSize="sm" fontWeight="medium" color="black" mb={2}>
                  Auth0 ID: <Text as="span" fontWeight="normal">{user.auth0Id}</Text>
                </Text> */}
                {userOrg && (
                  <>
                    <Text fontSize="sm" fontWeight="medium" color="black" mb={2}>
                      Organization: <Text as="span" fontWeight="normal">{userOrg.name}</Text>
                    </Text>
                    {/* <Text fontSize="sm" fontWeight="medium" color="black" mb={2}>
                      Organization ID: <Text as="span" fontWeight="normal">{userOrg.id}</Text>
                    </Text> */}
                    <Text fontSize="sm" fontWeight="medium" color="black" mb={2}>
                      Domain: <Text as="span" fontWeight="normal">{userOrg.domain}</Text>
                    </Text>
                  </>
                )}
              </Box>
              {/* <Box>
                <Flex justify="space-between" align="center" mb={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Access Token:
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Icon as={FiCopy} />}
                    onClick={handleCopyToken}
                  >
                    Copy Token
                  </Button>
                </Flex>
                <Code
                  display="block"
                  p={3}
                  borderRadius="md"
                  bg="gray.50"
                  fontSize="xs"
                  overflowX="auto"
                  whiteSpace="pre-wrap"
                  wordBreak="break-all"
                >
                  {accessToken}
                </Code>
              </Box> */}
            </VStack>
          </Box>
        )}

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          {stats.map((stat) => (
            <Box
              key={stat.label}
              bg="white"
              p={6}
              borderRadius="lg"
              borderWidth={1}
              borderColor="gray.200"
              _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              <VStack align="stretch" gap={2}>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="black" fontWeight="medium">
                    {stat.label}
                  </Text>
                  <Icon as={stat.icon} color={`${stat.color}.500`} boxSize={5} />
                </Flex>
                <Text fontSize="3xl" fontWeight="bold" color={`${stat.color}.600`}>
                  {stat.value}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        <Box mt={8} bg="white" p={6} borderRadius="lg" borderWidth={1} borderColor="gray.200">
          <Heading size="md" mb={4}>Quick Actions</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {/* TODO: Add quick action buttons */}
          </SimpleGrid>
        </Box>
      </Box>
    </DashboardLayout>
  )
}

export default Dashboard
