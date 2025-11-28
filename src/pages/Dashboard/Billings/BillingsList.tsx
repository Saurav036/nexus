import { useState, useEffect, useMemo } from 'react'
import { Box, Heading, Button, Icon, Flex, Text, Badge } from '@chakra-ui/react'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { billingsApi, ApiError } from '../../../services/api'
import type { Billing } from '../../../types/api'
import { toaster } from '../../../components/ui/toaster'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { useAuth } from '../../../contexts/AuthContext'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule])

const BillingsList = () => {
  const [billings, setBillings] = useState<Billing[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    fetchBillings()
  }, [])

  const fetchBillings = async () => {
    try {
      setLoading(true)
      const response = await billingsApi.getAll()
      console.log('Billings API response:', response)
      setBillings(response.data || [])
    } catch (error) {
      toaster.create({
        title: 'Error fetching billings',
        description: error instanceof ApiError ? error.message : 'Failed to load billings',
        type: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, planName: string) => {
    if (!window.confirm(`Are you sure you want to delete the billing plan "${planName}"?`)) {
      return
    }

    try {
      await billingsApi.delete(id)
      toaster.create({
        title: 'Billing deleted',
        description: `Successfully deleted billing plan "${planName}"`,
        type: 'success',
        duration: 3000,
      })
      fetchBillings()
    } catch (error) {
      toaster.create({
        title: 'Error deleting billing',
        description: error instanceof ApiError ? error.message : 'Failed to delete billing',
        type: 'error',
        duration: 5000,
      })
    }
  }

  // AG Grid column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'ID',
      field: 'id',
      sortable: true,
      filter: true,
      flex: 0.5,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          fontWeight: '600',
          color: '#2D3748'
        }}>
          #{params.value}
        </div>
      ),
    },
    {
      headerName: 'Plan Name',
      field: 'planName',
      sortable: true,
      filter: true,
      flex: 1,
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
      headerName: 'Start Date',
      field: 'planStartDate',
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          color: '#4A5568'
        }}>
          {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
    {
      headerName: 'Expiry Date',
      field: 'planExpiryDate',
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          color: '#4A5568'
        }}>
          {params.value ? new Date(params.value).toLocaleDateString() : 'N/A'}
        </div>
      ),
    },
    {
      headerName: 'Status',
      field: 'isActive',
      sortable: true,
      filter: true,
      flex: 0.7,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}>
          <span style={{
            padding: '4px 12px',
            backgroundColor: params.value ? '#C6F6D5' : '#FED7D7',
            borderRadius: '12px',
            color: params.value ? '#22543D' : '#C53030',
            fontSize: '0.85em',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            {params.value ? 'Active' : 'Inactive'}
          </span>
        </div>
      ),
    },
    {
      headerName: 'Actions',
      field: 'id',
      sortable: false,
      filter: false,
      flex: 1,
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
              navigate(`/dashboard/billings/${params.value}/edit`)
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#000000',
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
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2D3748'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000000'}
          >
            <span style={{ fontSize: '1.1em' }}>✏️</span>
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(params.value, params.data.planName)
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
  ], [navigate])

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
              Billings
            </Heading>
            <Text color="gray.600" fontSize="md">
              Manage your billing plans and subscriptions
            </Text>
          </Box>
          <Button
            bg="black"
            color="white"
            size="lg"
            onClick={() => navigate('/dashboard/billings/create')}
            boxShadow="md"
            _hover={{
              bg: 'gray.800',
              boxShadow: 'lg',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }}
          >
            <Icon as={FiPlus} mr={2} />
            New Billing Plan
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
            rowData={billings}
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

export default BillingsList
