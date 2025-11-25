import { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Button,
  Flex,
  Icon,
  Text,
  Spinner,
} from '@chakra-ui/react'
import { FiPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef } from 'ag-grid-community'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { orgsApi, usersApi, ApiError } from '../../../services/api'
import type { Org } from '../../../types/api'
import { toaster } from '../../../components/ui/toaster'
import { useAuth } from '../../../contexts/AuthContext'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'

const OrganizationsList = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [organizations, setOrganizations] = useState<Org[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrganizations()
  }, [user])

  const fetchOrganizations = async () => {
    if (!user?.auth0Id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      // First, get the user's organization from their user data
      const userResponse = await usersApi.getByAuth0Id(user.auth0Id)
      const userData = userResponse.data || userResponse.result

      // Get the user's organization(s) from UserOrgMaps
      if (userData.UserOrgMaps && userData.UserOrgMaps.length > 0) {
        // Extract unique organizations the user belongs to
        const userOrgs = userData.UserOrgMaps.map(mapping => mapping.org)
        setOrganizations(userOrgs)
      } else {
        setOrganizations([])
        toaster.create({
          title: 'No organization found',
          description: 'You are not associated with any organization',
          type: 'info',
          duration: 5000,
        })
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

  const columnDefs: ColDef<Org>[] = [
    {
      headerName: 'ID',
      field: 'id',
      sortable: true,
      filter: true,
      width: 100,
    },
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Domain',
      field: 'domain',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Auth0 ID',
      field: 'auth0Id',
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: 'Created At',
      field: 'createdAt',
      sortable: true,
      filter: true,
      flex: 1,
      valueFormatter: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString()
        }
        return ''
      },
    },
  ]

  return (
    <DashboardLayout>
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading color="gray.900">Organizations</Heading>
          <Button
            colorScheme="purple"
            size="lg"
            onClick={() => navigate('/dashboard/organizations/create')}
            _hover={{ boxShadow: 'lg' }}
            transition="all 0.2s"
          >
            <Flex align="center" gap={2}>
              <Icon as={FiPlus} />
              <Text>New Organization</Text>
            </Flex>
          </Button>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" h="400px">
            <Spinner size="xl" color="purple.500" />
          </Flex>
        ) : (
          <Box
            className="ag-theme-quartz"
            style={{ height: 'calc(100vh - 250px)', width: '100%' }}
          >
            <AgGridReact
              rowData={organizations}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={20}
              domLayout="normal"
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
              }}
            />
          </Box>
        )}
      </Box>
    </DashboardLayout>
  )
}

export default OrganizationsList
