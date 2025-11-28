import { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Button,
  Input,
  VStack,
  Flex,
  Icon,
  Text,
  Stack,
  Badge,
} from '@chakra-ui/react'
import { FiSave, FiArrowLeft, FiMail } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { usersApi, ApiError } from '../../../services/api'
import { authApi } from '../../../services/authApi'
import type { User, CreateUserDto, UpdateUserDto } from '../../../types/api'
import { toaster } from '../../../components/ui/toaster'
import { useAuth } from '../../../contexts/AuthContext'

interface UserFormProps {
  mode: 'create' | 'edit'
}

const UserForm = ({ mode }: UserFormProps) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user }:any = useAuth()

  const [loading, setLoading] = useState(false)
  const [orgAuth0Id, setOrgAuth0Id] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateUserDto | UpdateUserDto>({
    email: '',
    auth0Id: '',
  })

  // Get orgId from auth context
  useEffect(() => {
    console.log('👤 User from context:', user)
    console.log('🏢 User orgId:', user?.orgId)
    if (user?.orgId) {
      console.log('✅ Setting orgAuth0Id to:', user.orgId)
      setOrgAuth0Id(user.orgId)
    } else {
      console.warn('⚠️ No orgId found in user context')
    }
  }, [user])

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchUser(parseInt(id))
    }
  }, [mode, id])

  const fetchUser = async (userId: number) => {
    try {
      setLoading(true)
      const response = await usersApi.getById(userId)
      console.log('User API response:', response)
      const userDataFetched = response.data
      setFormData({
        email: userDataFetched.email,
        auth0Id: userDataFetched.auth0Id,
      })
    } catch (error) {
      toaster.create({
        title: 'Error loading user',
        description: error instanceof ApiError ? error.message : 'Failed to load user',
        type: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email) {
      toaster.create({
        title: 'Validation Error',
        description: 'Please fill in email',
        type: 'warning',
        duration: 3000,
      })
      return
    }

    try {
      setLoading(true)

      if (mode === 'create') {
        // Check if orgAuth0Id is available
        console.log('📋 Current orgAuth0Id:', orgAuth0Id)
        console.log('📋 User object:', user)

        if (!orgAuth0Id) {
          console.error('❌ Organization not loaded - orgAuth0Id is:', orgAuth0Id)
          toaster.create({
            title: 'Organization not loaded',
            description: 'Please wait for the organization to load or refresh the page',
            type: 'error',
            duration: 5000,
          })
          return
        }

        // Use invite endpoint with current user's name as inviter
        const inviterName = user?.name || user?.userEmail || 'Administrator'
        console.log('📧 Sending invitation with:', { orgAuth0Id, email: formData.email, inviterName })
        await authApi.inviteUser(orgAuth0Id, formData.email, inviterName)
        toaster.create({
          title: 'Invitation sent',
          description: `An invitation has been sent to ${formData.email}`,
          type: 'success',
          duration: 3000,
        })
      } else if (mode === 'edit' && id) {
        if (!formData.auth0Id) {
          toaster.create({
            title: 'Validation Error',
            description: 'Auth0 ID is required for updates',
            type: 'warning',
            duration: 3000,
          })
          return
        }
        await usersApi.update(parseInt(id), formData as UpdateUserDto)
        toaster.create({
          title: 'User updated',
          type: 'success',
          duration: 3000,
        })
      }

      navigate('/dashboard/users')
    } catch (error) {
      toaster.create({
        title: `Error ${mode === 'create' ? 'inviting' : 'updating'} user`,
        description: error instanceof Error ? error.message : 'Operation failed',
        type: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <Box maxW="600px">
        <Flex align="center" gap={3} mb={6}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/users')}
            color="gray.600"
            _hover={{ bg: 'gray.100' }}
          >
            <Flex align="center" gap={2}>
              <Icon as={FiArrowLeft} />
              <Text>Back</Text>
            </Flex>
          </Button>
          <Heading color="gray.900">{mode === 'create' ? 'Invite User' : 'Edit User'}</Heading>
        </Flex>

        <Box bg="white" p={6} borderRadius="lg" borderWidth={1}>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  Email <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  required
                  size="lg"
                  borderWidth={2}
                  _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
                  css={{
                    color: 'var(--chakra-colors-gray-900)',
                    '&::placeholder': { color: 'var(--chakra-colors-gray-400)' }
                  }}
                />
              </Box>

              {mode === 'edit' && (
                <Box>
                  <Text fontWeight="medium" mb={2} color="gray.700">
                    Auth0 ID <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    value={formData.auth0Id}
                    onChange={(e) => setFormData({ ...formData, auth0Id: e.target.value })}
                    placeholder="auth0|..."
                    required
                    size="lg"
                    borderWidth={2}
                    _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
                    css={{
                      color: 'var(--chakra-colors-gray-900)',
                      '&::placeholder': { color: 'var(--chakra-colors-gray-400)' }
                    }}
                  />
                </Box>
              )}

              <Flex gap={3} pt={4}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  color="gray.900"
                  variant="outline"
                  size="lg"
                  h={12}
                  loading={loading}
                  disabled={loading}
                  flex={1}
                  fontSize="md"
                  _hover={{ boxShadow: 'lg', color: 'gray.200' }}
                  transition="all 0.2s"
                >
                  <Flex align="center" gap={2}>
                    <Icon as={mode === 'create' ? FiMail : FiSave} />
                    <Text>{mode === 'create' ? 'Send Invitation' : 'Update User'}</Text>
                  </Flex>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  h={12}
                  onClick={() => navigate('/dashboard/users')}
                  disabled={loading}
                  color="gray.600"
                  _hover={{ bg: 'gray.100' }}
                >
                  Cancel
                </Button>
              </Flex>
            </Stack>
          </form>
        </Box>
      </Box>
    </DashboardLayout>
  )
}

export default UserForm
