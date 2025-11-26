import { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Button,
  Icon,
  Flex,
  Text,
  Spinner,
  IconButton,
} from '@chakra-ui/react'
import { FiPlus, FiEdit, FiTrash2, FiMoreVertical } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { usersApi, ApiError } from '../../../services/api'
import type { User } from '../../../types/api'
import { toaster } from '../../../components/ui/toaster'
import { useAuth } from '../../../contexts/AuthContext'




// todo take care of delete admin , table fields check , create user just email send. 



const UsersList = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [user])

  const fetchUsers = async () => {
    if (!user?.auth0Id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // First, get the current user's organization
      const currentUserResponse:any = await usersApi.getByAuth0Id(user.auth0Id)
     const currentUserData = currentUserResponse.data || currentUserResponse.result

      if (!currentUserData.UserOrgMaps || currentUserData.UserOrgMaps.length === 0) {
        setUsers([])
        toaster.create({
          title: 'No organization found',
          description: 'You are not associated with any organization',
          type: 'info',
          duration: 5000,
        })
        setLoading(false)
        return
      }

      // Get the user's orgId
      const userOrgId = currentUserData.UserOrgMaps[0].org.id

      // Fetch users by organization using the new endpoint
      const usersResponse = await usersApi.getByOrganization(userOrgId)
      const orgUsers = usersResponse.result || []

      setUsers(orgUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      toaster.create({
        title: 'Error fetching users',
        description: error instanceof ApiError ? error.message : 'Failed to load users',
        type: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await usersApi.delete(id)
      toaster.create({
        title: 'User deleted',
        type: 'success',
        duration: 3000,
      })
      fetchUsers()
    } catch (error) {
      toaster.create({
        title: 'Error deleting user',
        description: error instanceof ApiError ? error.message : 'Failed to delete user',
        type: 'error',
        duration: 5000,
      })
    }
  }

  return (
    <DashboardLayout>
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading>Users</Heading>
          <Button
            colorScheme="purple"
            onClick={() => navigate('/dashboard/users/create')}
          >
            <Icon as={FiPlus} mr={2} />
            Invite User
          </Button>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" h="200px">
            <Spinner size="xl" color="purple.500" />
          </Flex>
        ) : users?.length === 0 ? (
          <Box textAlign="center" py={10} bg="white" borderRadius="lg" borderWidth={1}>
            <Text color="gray.500">No users found. Invite your first user to get started.</Text>
            <Button
              mt={4}
              colorScheme="purple"
              variant="outline"
              onClick={() => navigate('/dashboard/users/create')}
            >
              <Icon as={FiPlus} mr={2} />
              Invite User
            </Button>
          </Box>
        ) : (
          <Box bg="white" borderRadius="lg" borderWidth={1} overflow="hidden">
            {/* Header */}
            <Flex bg="gray.50" p={4} borderBottomWidth={1} fontWeight="semibold" fontSize="sm" color="gray.700">
              <Box flex="0 0 80px">ID</Box>
              <Box flex="1">Email</Box>
              <Box flex="1">Auth0 ID</Box>
              <Box flex="0 0 150px">Created At</Box>
              <Box flex="0 0 100px" textAlign="right">Actions</Box>
            </Flex>

            {/* Rows */}
            {users?.map((user) => (
              <Flex
                key={user.id}
                p={4}
                borderBottomWidth={1}
                _last={{ borderBottom: 'none' }}
                _hover={{ bg: 'gray.50' }}
                align="center"
                color="gray.900"
              >
                <Box flex="0 0 80px" fontWeight="medium">{user.id}</Box>
                <Box flex="1">{user.email}</Box>
                <Box flex="1">
                  <Text fontSize="sm" color="gray.600">
                    {user.auth0Id}
                  </Text>
                </Box>
                <Box flex="0 0 150px">
                  <Text fontSize="sm" color="gray.600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </Text>
                </Box>
                <Flex flex="0 0 100px" justify="flex-end" gap={2}>
                  <IconButton
                    aria-label="Edit user"
                    size="sm"
                    variant="ghost"
                    color="gray.700"
                    onClick={() => navigate(`/dashboard/users/${user.id}/edit`)}
                  >
                    <Icon as={FiEdit} />
                  </IconButton>
                  <IconButton
                    aria-label="Delete user"
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Icon as={FiTrash2} />
                  </IconButton>
                </Flex>
              </Flex>
            ))}
          </Box>
        )}
      </Box>
    </DashboardLayout>
  )
}

export default UsersList
