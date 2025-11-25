import { useState, useEffect, useMemo } from 'react'
import { Box, Heading, Button, Icon, Flex, Text, Badge } from '@chakra-ui/react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { connectionsApi, ApiError } from '../../../services/api'
import type { Connection } from '../../../types/api'
import { toaster } from '../../../components/ui/toaster'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule])

const ConnectionsList = () => {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      setLoading(true)
      const response = await connectionsApi.getAll()
      console.log('Connections API response:', response)
      setConnections(response.result || [])
    } catch (error) {
      toaster.create({
        title: 'Error fetching connections',
        description: error instanceof ApiError ? error.message : 'Failed to load connections',
        type: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the connection "${name}"?`)) {
      return
    }

    try {
      await connectionsApi.delete(id)
      toaster.create({
        title: 'Connection deleted',
        description: `Successfully deleted connection "${name}"`,
        type: 'success',
        duration: 3000,
      })
      // Refresh the connections list
      fetchConnections()
    } catch (error) {
      toaster.create({
        title: 'Error deleting connection',
        description: error instanceof ApiError ? error.message : 'Failed to delete connection',
        type: 'error',
        duration: 5000,
      })
    }
  }

  // AG Grid column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Connection Name',
      field: 'name',
      sortable: true,
      filter: true,
      flex: 1.2,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: '600',
          color: '#2D3748'
        }}>
          {params.value}
        </div>
      ),
    },
    {
      headerName: 'Server URL',
      field: 'server',
      sortable: true,
      filter: true,
      flex: 2,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          color: '#4A5568',
          fontFamily: 'monospace',
          fontSize: '0.9em'
        }}>
          {params.value}
        </div>
      ),
    },
    {
      headerName: 'Site',
      field: 'site',
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <span style={{
            padding: '4px 12px',
            backgroundColor: '#EDF2F7',
            borderRadius: '12px',
            color: '#4A5568',
            fontSize: '0.85em',
            fontWeight: '500'
          }}>
            {params.value}
          </span>
        </div>
      ),
    },
    {
      headerName: 'Credential ID',
      field: 'credentialId',
      sortable: true,
      filter: true,
      flex: 0.8,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <span style={{
            padding: '4px 10px',
            backgroundColor: '#E6FFFA',
            borderRadius: '8px',
            color: '#047857',
            fontSize: '0.85em',
            fontWeight: '600',
            border: '1px solid #81E6D9'
          }}>
            #{params.value}
          </span>
        </div>
      ),
    },
    {
      headerName: 'Actions',
      field: 'id',
      sortable: false,
      filter: false,
      flex: 0.8,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          gap: '8px'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/dashboard/connections/${params.value}/edit`)
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#3182CE',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85em',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2C5282'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3182CE'}
          >
            <span style={{ fontSize: '1.1em' }}>✏️</span>
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(params.value, params.data.name)
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#E53E3E',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85em',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#C53030'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#E53E3E'}
          >
            <span style={{ fontSize: '1.1em' }}>🗑️</span>
            Delete
          </button>
        </div>
      ),
    },
  ], [navigate, handleDelete])

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
    cellStyle: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: '8px',
      paddingBottom: '8px'
    },
  }), [])

  return (
    <DashboardLayout>
      <Box>
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Heading size="xl" color="gray.800" mb={2}>
              Connections
            </Heading>
            <Text color="gray.600" fontSize="md">
              Manage your Tableau server connections
            </Text>
          </Box>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate('/dashboard/connections/create')}
            boxShadow="md"
            _hover={{
              boxShadow: 'lg',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }}
          >
            <Icon as={FiPlus} mr={2} />
            New Connection
          </Button>
        </Flex>

        <Box
          className="ag-theme-quartz"
          bg="white"
          borderRadius="xl"
          borderWidth={1}
          borderColor="gray.200"
          overflow="hidden"
          boxShadow="sm"
          style={{ height: '650px', width: '100%' }}
        >
          <AgGridReact
            rowData={connections}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            loading={loading}
            pagination={true}
            paginationPageSize={20}
            domLayout='normal'
            rowHeight={60}
            headerHeight={50}
            animateRows={true}
            rowStyle={{ cursor: 'pointer' }}
            getRowStyle={(params) => {
              if (params.node.rowIndex !== undefined && params.node.rowIndex % 2 === 0) {
                return { background: '#F9FAFB' }
              }
              return { background: 'white' }
            }}
          />
        </Box>
      </Box>
    </DashboardLayout>
  )
}

export default ConnectionsList
