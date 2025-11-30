import { useState, useEffect } from 'react'
import { Box, Heading, SimpleGrid, Icon, Text, Flex, VStack, Code, Button, Badge, Spinner } from '@chakra-ui/react'
import { FiUsers, FiDatabase, FiFileText, FiLink, FiCopy, FiShield, FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { useAuth } from '../../contexts/AuthContext'
import { toaster } from '../../components/ui/toaster'
import { usersApi, connectionsApi, reportsApi, ApiError } from '../../services/api'
import type { User as UserType, Connection, Report } from '../../types/api'

const Dashboard = () => {
  const { user, accessToken } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConnections: 0,
    totalReports: 0,
  })
  const [recentReports, setRecentReports] = useState<Report[]>([])
  const [recentConnections, setRecentConnections] = useState<Connection[]>([])

  useEffect(() => {
    if (user?.orgDbId) {
      fetchDashboardData()
    } else if (user && !user.orgDbId) {
      // User is loaded but no orgDbId, stop loading
      setLoading(false)
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user?.orgDbId) return

    try {
      setLoading(true)
      const orgDbId = user.orgDbId

      // Fetch stats based on user role
      let usersCount = 0
      let connectionsData: Connection[] = []
      let reportsData: Report[] = []

      // Only fetch users if ADMIN
      if (user.role === 'ADMIN') {
        try {
          const usersResponse = await usersApi.getByOrganization(orgDbId)
          usersCount = (usersResponse as any).result?.length || usersResponse.data?.length || 0
        } catch (error) {
          console.error('Error fetching users:', error)
        }

        try {
          const connectionsResponse = await connectionsApi.getAll()
          connectionsData = (connectionsResponse as any).result || connectionsResponse.data || []
        } catch (error) {
          console.error('Error fetching connections:', error)
        }
      }

      // Both ADMIN and MEMBER can see reports
      try {
        const reportsResponse = await reportsApi.getByOrg(orgDbId)
        // API returns 'result' field, not 'data'
        reportsData = (reportsResponse as any).result || reportsResponse.data || []
      } catch (error) {
        console.error('Error fetching reports:', error)
      }

      setStats({
        totalUsers: usersCount,
        totalConnections: connectionsData.length,
        totalReports: reportsData.length,
      })

      // Set recent items (last 5)
      setRecentReports(reportsData.slice(0, 5))
      setRecentConnections(connectionsData.slice(0, 5))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatsConfig = () => {
    if (user?.role === 'ADMIN') {
      return [
        { label: 'Total Users', value: stats.totalUsers.toString(), icon: FiUsers, color: 'blue', link: '/dashboard/users' },
        { label: 'Connections', value: stats.totalConnections.toString(), icon: FiLink, color: 'orange', link: '/dashboard/connections' },
        { label: 'Active Reports', value: stats.totalReports.toString(), icon: FiFileText, color: 'green', link: '/dashboard/reports' },
      ]
    } else {
      return [
        { label: 'Active Reports', value: stats.totalReports.toString(), icon: FiFileText, color: 'green', link: '/dashboard/reports' },
      ]
    }
  }

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

  if (loading) {
    return (
      <DashboardLayout>
        <Flex justify="center" align="center" h="400px">
          <Spinner size="xl" color="purple.500" />
        </Flex>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Box>
        <Heading mb={6} color="gray.900">Dashboard</Heading>

        {/* Display User Info */}
        {user && (
          <Box mb={6} bg="white" p={6} borderRadius="lg" borderWidth={1} borderColor="gray.200">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color="gray.900">Welcome back, {user.name || user.userEmail}!</Heading>
              {user.role && (
                <Badge bg={user.role === 'ADMIN' ? 'purple.500' : 'blue.500'} color="white" size="lg" px={3} py={1}>
                  {user.role}
                </Badge>
              )}
            </Flex>
            <VStack align="stretch" gap={2}>
              <Flex gap={8}>
                <Box>
                  <Text fontSize="sm" color="gray.600">Email</Text>
                  <Text fontSize="md" fontWeight="medium" color="gray.900">{user.userEmail}</Text>
                </Box>
                {user.orgName && (
                  <Box>
                    <Text fontSize="sm" color="gray.600">Organization</Text>
                    <Text fontSize="md" fontWeight="medium" color="gray.900">{user.orgName}</Text>
                  </Box>
                )}
              </Flex>
            </VStack>
          </Box>
        )}

        {/* Stats Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: user?.role === 'ADMIN' ? 3 : 1 }} gap={6} mb={8}>
          {getStatsConfig().map((stat) => (
            <Box
              key={stat.label}
              bg="white"
              p={6}
              borderRadius="lg"
              borderWidth={1}
              borderColor="gray.200"
              _hover={{ boxShadow: 'md', transform: 'translateY(-2px)', cursor: 'pointer' }}
              transition="all 0.2s"
              onClick={() => navigate(stat.link)}
            >
              <VStack align="stretch" gap={2}>
                <Flex justify="space-between" align="center">
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    {stat.label}
                  </Text>
                  <Icon as={stat.icon} color={`${stat.color}.500`} boxSize={6} />
                </Flex>
                <Text fontSize="4xl" fontWeight="bold" color={`${stat.color}.600`}>
                  {stat.value}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        {/* Recent Reports */}
        {recentReports.length > 0 && (
          <Box mb={8} bg="white" p={6} borderRadius="lg" borderWidth={1} borderColor="gray.200">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color="gray.900">Recent Reports</Heading>
              <Button
                size="sm"
                variant="outline"
                borderColor="purple.500"
                color="purple.500"
                _hover={{ bg: 'purple.50' }}
                onClick={() => navigate('/dashboard/reports')}
              >
                View All
              </Button>
            </Flex>
            <VStack align="stretch" gap={3}>
              {recentReports.map((report) => (
                <Box
                  key={report.id}
                  p={4}
                  borderWidth={1}
                  borderColor="gray.200"
                  borderRadius="md"
                  _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                  onClick={() => navigate(`/dashboard/reports/${report.id}/edit`)}
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="semibold" color="gray.900">{report.workbookName}</Text>
                      <Text fontSize="sm" color="gray.600">{report.viewName}</Text>
                    </Box>
                    <Badge bg="green.500" color="white">{report.fileFormat}</Badge>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* Recent Connections - Admin Only */}
        {user?.role === 'ADMIN' && recentConnections.length > 0 && (
          <Box mb={8} bg="white" p={6} borderRadius="lg" borderWidth={1} borderColor="gray.200">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color="gray.900">Recent Connections</Heading>
              <Button
                size="sm"
                variant="outline"
                borderColor="orange.500"
                color="orange.500"
                _hover={{ bg: 'orange.50' }}
                onClick={() => navigate('/dashboard/connections')}
              >
                View All
              </Button>
            </Flex>
            <VStack align="stretch" gap={3}>
              {recentConnections.map((connection) => (
                <Box
                  key={connection.id}
                  p={4}
                  borderWidth={1}
                  borderColor="gray.200"
                  borderRadius="md"
                  _hover={{ bg: 'gray.50', cursor: 'pointer' }}
                  onClick={() => navigate(`/dashboard/connections/${connection.id}/edit`)}
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="semibold" color="gray.900">{connection.name}</Text>
                      <Text fontSize="sm" color="gray.600">{connection.server}</Text>
                    </Box>
                    <Text fontSize="sm" color="gray.500">{connection.site}</Text>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        {/* Quick Actions */}
        <Box bg="white" p={6} borderRadius="lg" borderWidth={1} borderColor="gray.200">
          <Heading size="md" mb={4} color="gray.900">Quick Actions</Heading>
          <SimpleGrid columns={{ base: 1, md: user?.role === 'ADMIN' ? 3 : 2 }} gap={4}>
            <Button
              size="lg"
              bg="green.500"
              color="white"
              _hover={{ bg: 'green.600' }}
              onClick={() => navigate('/dashboard/reports/create')}
            >
              <Icon as={FiPlus} mr={2} />
              Create New Report
            </Button>
            {user?.role === 'ADMIN' && (
              <>
                <Button
                  size="lg"
                  bg="orange.500"
                  color="white"
                  _hover={{ bg: 'orange.600' }}
                  onClick={() => navigate('/dashboard/connections/create')}
                >
                  <Icon as={FiPlus} mr={2} />
                  Add Connection
                </Button>
                <Button
                  size="lg"
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: 'blue.600' }}
                  onClick={() => navigate('/dashboard/users/create')}
                >
                  <Icon as={FiPlus} mr={2} />
                  Invite User
                </Button>
              </>
            )}
          </SimpleGrid>
        </Box>
      </Box>
    </DashboardLayout>
  )
}

export default Dashboard
