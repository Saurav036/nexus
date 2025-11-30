import { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Button,
  Flex,
  Icon,
  Text,
  Spinner,
  Grid,
  VStack,
  Badge,
} from '@chakra-ui/react'
import { FiPlus, FiDatabase, FiGlobe, FiKey, FiCalendar, FiHash, FiUsers } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { orgsApi, usersApi, ApiError } from '../../../services/api'
import type { Org } from '../../../types/api'
import { toaster } from '../../../components/ui/toaster'
import { useAuth } from '../../../contexts/AuthContext'

const OrganizationsList = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [organization, setOrganization] = useState<Org | null>(null)
  const [loading, setLoading] = useState(true)
  const [userCount, setUserCount] = useState<number>(0)

  useEffect(() => {
    fetchOrganizations()
  }, [user])

  const fetchOrganizations = async () => {
    if (!user?.orgId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // Fetch organization details from API using auth0Id
      const response = await orgsApi.getByAuth0Id(user.orgId)
      const org = response.data

      setOrganization(org)

      // Fetch users count for this organization
      if (user?.orgDbId) {
        try {
          const usersResponse = await usersApi.getByOrganization(user.orgDbId)
          setUserCount(usersResponse.data?.length || 0)
        } catch (error) {
          console.error('Error fetching user count:', error)
        }
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      toaster.create({
        title: 'Error loading organizations',
        description: error instanceof ApiError ? error.message : 'Failed to load organizations',
        type: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading size="xl" color="gray.800" mb={2}>
              Organization
            </Heading>
            <Text color="gray.600" fontSize="md">
              Your organization details and information
            </Text>
          </Box>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" h="400px">
            <Spinner size="xl" color="gray.900" />
          </Flex>
        ) : organization ? (
          <VStack gap={6} align="stretch">
            {/* Main Organization Card */}
            <Box
              bg="white"
              borderRadius="xl"
              borderWidth={1}
              borderColor="gray.200"
              p={8}
              boxShadow="sm"
            >
              <Flex align="center" gap={4} mb={6}>
                <Flex
                  bg="black"
                  w={16}
                  h={16}
                  borderRadius="xl"
                  align="center"
                  justify="center"
                >
                  <Icon as={FiDatabase} boxSize={8} color="white" />
                </Flex>
                <Box>
                  <Heading size="lg" color="gray.900" mb={1}>
                    {organization.name}
                  </Heading>
                  <Text color="gray.600" fontSize="md">
                    {organization.domain}
                  </Text>
                </Box>
              </Flex>

              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                gap={6}
              >
                {/* Database ID */}
                <Box
                  bg="gray.50"
                  p={5}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor="gray.200"
                >
                  <Flex align="center" gap={3} mb={2}>
                    <Icon as={FiHash} color="gray.600" boxSize={5} />
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600" textTransform="uppercase">
                      Database ID
                    </Text>
                  </Flex>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                    {organization.id}
                  </Text>
                </Box>

                {/* Auth0 Organization ID */}
                <Box
                  bg="gray.50"
                  p={5}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor="gray.200"
                >
                  <Flex align="center" gap={3} mb={2}>
                    <Icon as={FiKey} color="gray.600" boxSize={5} />
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600" textTransform="uppercase">
                      Auth0 Org ID
                    </Text>
                  </Flex>
                  <Text fontSize="sm" fontWeight="semibold" color="gray.900" fontFamily="monospace" wordBreak="break-all">
                    {organization.auth0Id}
                  </Text>
                </Box>

                {/* Total Users */}
                <Box
                  bg="gray.50"
                  p={5}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor="gray.200"
                >
                  <Flex align="center" gap={3} mb={2}>
                    <Icon as={FiUsers} color="gray.600" boxSize={5} />
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600" textTransform="uppercase">
                      Total Users
                    </Text>
                  </Flex>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.900">
                    {userCount}
                  </Text>
                </Box>

                {/* Domain */}
                <Box
                  bg="gray.50"
                  p={5}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor="gray.200"
                >
                  <Flex align="center" gap={3} mb={2}>
                    <Icon as={FiGlobe} color="gray.600" boxSize={5} />
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600" textTransform="uppercase">
                      Domain
                    </Text>
                  </Flex>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                    {organization.domain}
                  </Text>
                </Box>

                {/* Created Date */}
                <Box
                  bg="gray.50"
                  p={5}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor="gray.200"
                >
                  <Flex align="center" gap={3} mb={2}>
                    <Icon as={FiCalendar} color="gray.600" boxSize={5} />
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600" textTransform="uppercase">
                      Created
                    </Text>
                  </Flex>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.900">
                    {organization.createdAt
                      ? new Date(organization.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'
                    }
                  </Text>
                </Box>

                {/* Encryption Key Status */}
                <Box
                  bg="gray.50"
                  p={5}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor="gray.200"
                >
                  <Flex align="center" gap={3} mb={2}>
                    <Icon as={FiKey} color="gray.600" boxSize={5} />
                    <Text fontSize="sm" fontWeight="semibold" color="gray.600" textTransform="uppercase">
                      Encryption
                    </Text>
                  </Flex>
                  <Badge
                    bg="green.100"
                    color="green.800"
                    px={3}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="semibold"
                  >
                    ✓ Enabled
                  </Badge>
                </Box>
              </Grid>
            </Box>
          </VStack>
        ) : (
          <Box textAlign="center" py={10} bg="white" borderRadius="lg" borderWidth={1}>
            <Text color="gray.500">No organization found.</Text>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  )
}

export default OrganizationsList
