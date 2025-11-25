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
} from '@chakra-ui/react'
import { RadioGroup } from '../../../components/ui/radio'
import { FiSave, FiArrowLeft } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { connectionsApi, ApiError, usersApi } from '../../../services/api'
import type { Connection, CreateConnectionDto, UpdateConnectionDto, CreateCredentialDto, CreateConnectionWithCredentialsDto } from '../../../types/api'
import { credentialsApi } from '../../../services/api'
import { toaster } from '../../../components/ui/toaster'
import { useAuth } from '../../../contexts/AuthContext'

interface ConnectionFormProps {
  mode: 'create' | 'edit'
}

type AuthType = 'credentials' | 'pat'

const ConnectionForm = ({ mode }: ConnectionFormProps) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [authType, setAuthType] = useState<AuthType>('credentials')
  const [orgId, setOrgId] = useState<number | null>(null)
  const [credentialId, setCredentialId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    server: '',
    site: '',
    username: '',
    password: '',
    patToken: '',
    patName: '',
  })

  // Fetch user's orgId from the backend
  useEffect(() => {
    const fetchOrgId = async () => {
      if (user?.auth0Id) {
        try {
          const response = await usersApi.getByAuth0Id(user.auth0Id)
          const userData = response.result

          // Get the first org from UserOrgMaps
          if (userData.UserOrgMaps && userData.UserOrgMaps.length > 0) {
            setOrgId(userData.UserOrgMaps[0].org.id)
          } else {
            toaster.create({
              title: 'No organization found',
              description: 'Please contact your administrator',
              type: 'error',
              duration: 5000,
            })
          }
        } catch (error) {
          console.error('Error fetching user org:', error)
          toaster.create({
            title: 'Error loading organization',
            description: error instanceof ApiError ? error.message : 'Failed to load organization',
            type: 'error',
            duration: 5000,
          })
        }
      }
    }

    fetchOrgId()
  }, [user])

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchConnection(parseInt(id))
    }
  }, [mode, id])

  const fetchConnection = async (connectionId: number) => {
    try {
      setLoading(true)
      const response = await connectionsApi.getById(connectionId)
      console.log('Connection API response:', response)
      const connection = response.result

      // Store credentialId for updating later
      setCredentialId(connection.credentialId)

      // Fetch credential details to get the auth type and username/PAT name
      try {
        const credResponse = await credentialsApi.getById(connection.credentialId)
        const credential = credResponse.result

        // Set auth type based on credential type
        const credType = credential.connectionType || 'USERNAME'
        setAuthType(credType === 'USERNAME' ? 'credentials' : 'pat')

        setFormData({
          name: connection.name || '',
          server: connection.server || '',
          site: connection.site || '',
          username: credType === 'USERNAME' ? (credential.username || '') : '',
          password: '',
          patToken: '',
          patName: credType === 'PAT' ? (credential.tokenName || '') : '',
        })
      } catch (credError) {
        console.error('Error fetching credential:', credError)
        // If credential fetch fails, just load connection info
        setAuthType('credentials')
        setFormData({
          name: connection.name || '',
          server: connection.server || '',
          site: connection.site || '',
          username: '',
          password: '',
          patToken: '',
          patName: '',
        })
      }
    } catch (error) {
      toaster.create({
        title: 'Error loading connection',
        description: error instanceof ApiError ? error.message : 'Failed to load connection',
        type: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate based on auth type
    if (!formData.name || !formData.server) {
      toaster.create({
        title: 'Validation Error',
        description: 'Please fill in name and server',
        type: 'warning',
        duration: 3000,
      })
      return
    }

    if (authType === 'credentials') {
      if (!formData.username) {
        toaster.create({
          title: 'Validation Error',
          description: 'Please fill in username',
          type: 'warning',
          duration: 3000,
        })
        return
      }
      // Password is required only for create mode
      if (mode === 'create' && !formData.password) {
        toaster.create({
          title: 'Validation Error',
          description: 'Please fill in password',
          type: 'warning',
          duration: 3000,
        })
        return
      }
    } else {
      if (!formData.patName) {
        toaster.create({
          title: 'Validation Error',
          description: 'Please fill in PAT name',
          type: 'warning',
          duration: 3000,
        })
        return
      }
      // Token is required only for create mode
      if (mode === 'create' && !formData.patToken) {
        toaster.create({
          title: 'Validation Error',
          description: 'Please fill in PAT token',
          type: 'warning',
          duration: 3000,
        })
        return
      }
    }

    // Check if orgId is available
    if (!orgId) {
      toaster.create({
        title: 'Organization not loaded',
        description: 'Please wait for the organization to load or refresh the page',
        type: 'error',
        duration: 5000,
      })
      return
    }

    try {
      setLoading(true)

      if (mode === 'create') {
        // Use the new with-credentials endpoint
        const connectionWithCredentialsData: CreateConnectionWithCredentialsDto = {
          orgId: orgId,
          name: formData.name,
          server: formData.server,
          site: formData.site || 'Default',
          connectionType: authType === 'credentials' ? 'USERNAME' : 'PAT',
          tokenName: authType === 'pat' ? formData.patName : 'N/A',
          tokenSecret: authType === 'pat' ? formData.patToken : 'N/A',
          username: authType === 'credentials' ? formData.username : 'N/A',
          password: authType === 'credentials' ? formData.password : 'N/A',
        }

        await connectionsApi.createWithCredentials(connectionWithCredentialsData)
        toaster.create({
          title: 'Connection created',
          type: 'success',
          duration: 3000,
        })
      } else if (mode === 'edit' && id) {
        // For edit mode, send the full data with credentials
        const updateData: any = {
          orgId: orgId,
          name: formData.name,
          server: formData.server,
          site: formData.site || 'Default',
          connectionType: authType === 'credentials' ? 'USERNAME' : 'PAT',
        }

        // Add credentials based on auth type
        if (authType === 'credentials') {
          updateData.username = formData.username
          // Only send password if provided (not empty)
          updateData.password = formData.password || undefined
          updateData.tokenName = 'N/A'
          updateData.tokenSecret = 'N/A'
        } else {
          updateData.tokenName = formData.patName
          // Only send token if provided (not empty)
          updateData.tokenSecret = formData.patToken || undefined
          updateData.username = 'N/A'
          updateData.password = 'N/A'
        }

        await connectionsApi.update(parseInt(id), updateData)
        toaster.create({
          title: 'Connection updated',
          type: 'success',
          duration: 3000,
        })
      }

      navigate('/dashboard/connections')
    } catch (error) {
      toaster.create({
        title: `Error ${mode === 'create' ? 'creating' : 'updating'} connection`,
        description: error instanceof ApiError ? error.message : 'Operation failed',
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
            onClick={() => navigate('/dashboard/connections')}
            color="gray.600"
            _hover={{ bg: 'gray.100' }}
          >
            <Flex align="center" gap={2}>
              <Icon as={FiArrowLeft} />
              <Text>Back</Text>
            </Flex>
          </Button>
          <Heading color="gray.900">{mode === 'create' ? 'New Connection' : 'Edit Connection'}</Heading>
        </Flex>

        <Box bg="white" p={6} borderRadius="lg" borderWidth={1}>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  Name <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tableau Tableau"
                  required
                  size="lg"
                  borderWidth={2}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  Server <Text as="span" color="red.500">*</Text>
                </Text>
                <Input
                  value={formData.server}
                  onChange={(e) => setFormData({ ...formData, server: e.target.value })}
                  placeholder="https://tableau.example.com"
                  required
                  size="lg"
                  borderWidth={2}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  Site
                </Text>
                <Input
                  value={formData.site}
                  onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                  placeholder="Default"
                  size="lg"
                  borderWidth={2}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  Authentication Type <Text as="span" color="red.500">*</Text>
                </Text>
                <RadioGroup.Root value={authType} onValueChange={(e) => setAuthType(e.value as AuthType)}>
                  <Stack direction="row" gap={6}>
                    <RadioGroup.Item value="credentials">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText fontSize="sm">Username/Password</RadioGroup.ItemText>
                    </RadioGroup.Item>
                    <RadioGroup.Item value="pat">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText fontSize="sm">Personal Access Token (PAT)</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </Stack>
                </RadioGroup.Root>
              </Box>

              {authType === 'credentials' ? (
                <>
                  <Box>
                    <Text fontWeight="medium" mb={2} color="gray.700">
                      Username <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="tableau_user"
                      size="lg"
                      borderWidth={2}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="medium" mb={2} color="gray.700">
                      Password {mode === 'create' && <Text as="span" color="red.500">*</Text>}
                    </Text>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={mode === 'edit' ? 'Leave empty to keep current password' : 'Enter password'}
                      size="lg"
                      borderWidth={2}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Box>
                    <Text fontWeight="medium" mb={2} color="gray.700">
                      PAT Name <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      value={formData.patName}
                      onChange={(e) => setFormData({ ...formData, patName: e.target.value })}
                      placeholder="My PAT Name"
                      size="lg"
                      borderWidth={2}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="medium" mb={2} color="gray.700">
                      PAT Token <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Input
                      type="password"
                      value={formData.patToken}
                      onChange={(e) => setFormData({ ...formData, patToken: e.target.value })}
                      placeholder={mode === 'edit' ? 'Leave empty to keep current token' : 'Enter PAT token'}
                      size="lg"
                      borderWidth={2}
                      _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                    />
                  </Box>
                </>
              )}

              <Flex gap={3} pt={4}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  h={12}
                  loading={loading}
                  disabled={loading}
                  flex={1}
                  fontSize="md"
                  _hover={{ boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  <Flex align="center" gap={2}>
                    <Icon as={FiSave} />
                    <Text>{mode === 'create' ? 'Create Connection' : 'Update Connection'}</Text>
                  </Flex>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  h={12}
                  onClick={() => navigate('/dashboard/connections')}
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

export default ConnectionForm
