import { useState, useEffect, useMemo } from 'react'
import { Box, Heading, Button, Icon, Flex, Text, Drawer, Stack, Input, Code } from '@chakra-ui/react'
import { FiPlus, FiTrash2, FiEye, FiX, FiCopy } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { reportsApi, ApiError } from '../../../services/api'
import type { Report } from '../../../types/api'
import { toaster } from '../../../components/ui/toaster'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import type { ColDef, ICellRendererParams } from 'ag-grid-community'

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule])


//todo change reports fetch list by org
const ReportsList = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedReportDetails, setSelectedReportDetails] = useState<any>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response:any = await reportsApi.getAll()
      console.log('Reports API response:', response)
      setReports(response.data || response.result || [])
    } catch (error) {
      toaster.create({
        title: 'Error fetching reports',
        description: error instanceof ApiError ? error.message : 'Failed to load reports',
        type: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, workbookName: string) => {
    if (!window.confirm(`Are you sure you want to delete the report for "${workbookName}"?`)) {
      return
    }

    try {
      await reportsApi.delete(id)
      toaster.create({
        title: 'Report deleted',
        description: `Successfully deleted report for "${workbookName}"`,
        type: 'success',
        duration: 3000,
      })
      // Refresh the reports list
      fetchReports()
    } catch (error) {
      toaster.create({
        title: 'Error deleting report',
        description: error instanceof ApiError ? error.message : 'Failed to delete report',
        type: 'error',
        duration: 5000,
      })
    }
  }

  const handleViewReportUrl = async (id: number) => {
    try {
      setLoadingDetails(true)
      setDrawerOpen(true)
      const response:any = await reportsApi.getApiDetailsById(id)
      const reportDetails = response.data || response.result || []
      setSelectedReportDetails(reportDetails)
      console.log('Report API Details:', reportDetails)
    } catch (error) {
      toaster.create({
        title: 'Error fetching report details',
        description: error instanceof ApiError ? error.message : 'Failed to fetch report API details',
        type: 'error',
        duration: 5000,
      })
      setDrawerOpen(false)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toaster.create({
      title: 'Copied to clipboard',
      type: 'success',
      duration: 2000,
    })
  }

  // AG Grid column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Workbook',
      field: 'workbookName',
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
          📊 {params.value}
        </div>
      ),
    },
    {
      headerName: 'View',
      field: 'viewName',
      sortable: true,
      filter: true,
      flex: 1.2,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          color: '#4A5568'
        }}>
          {params.value}
        </div>
      ),
    },
    {
      headerName: 'Format',
      field: 'fileFormat',
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
            backgroundColor: params.value === 'pdf' ? '#FED7D7' : '#C6F6D5',
            borderRadius: '12px',
            color: params.value === 'pdf' ? '#C53030' : '#22543D',
            fontSize: '0.85em',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            {params.value}
          </span>
        </div>
      ),
    },
    {
      headerName: 'Orientation',
      field: 'orientation',
      sortable: true,
      filter: true,
      flex: 0.9,
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
      headerName: 'Connection ID',
      field: 'connectionId',
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
      headerName: 'Workbook ID',
      field: 'workbookId',
      sortable: true,
      filter: true,
      flex: 1,
      cellRenderer: (params: ICellRendererParams) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          color: '#718096',
          fontFamily: 'monospace',
          fontSize: '0.85em'
        }}>
          {params.value}
        </div>
      ),
    },
    {
      headerName: 'Actions',
      field: 'id',
      sortable: false,
      filter: false,
      flex: 1.5,
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
              navigate(`/dashboard/reports/${params.value}/edit`)
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
              handleViewReportUrl(params.value)
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#805AD5',
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
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6B46C1'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#805AD5'}
          >
            <span style={{ fontSize: '1.1em' }}>👁️</span>
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(params.value, params.data.workbookName)
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
  ], [navigate, handleDelete, handleViewReportUrl, handleCopyToClipboard])

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
              Reports
            </Heading>
            <Text color="gray.600" fontSize="md">
              Manage your Tableau report configurations
            </Text>
          </Box>
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate('/dashboard/reports/create')}
            boxShadow="md"
            _hover={{
              boxShadow: 'lg',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s'
            }}
          >
            <Icon as={FiPlus} mr={2} />
            New Report
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
            rowData={reports}
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

      {/* Drawer for viewing report details */}
      <Drawer.Root open={drawerOpen} onOpenChange={(e) => setDrawerOpen(e.open)} size="md" placement="end">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Flex justify="space-between" align="center">
                <Heading size="lg" color="gray.800">Report API Details</Heading>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDrawerOpen(false)}
                  color="gray.600"
                  _hover={{ bg: 'gray.100' }}
                >
                  <Icon as={FiX} fontSize="xl" />
                </Button>
              </Flex>
            </Drawer.Header>
            <Drawer.Body>
              {loadingDetails ? (
                <Flex justify="center" align="center" h="200px">
                  <Text color="gray.600">Loading report details...</Text>
                </Flex>
              ) : selectedReportDetails ? (
                <Stack gap={6}>
                  {/* API URL */}
                  <Box>
                    <Text fontWeight="semibold" mb={2} color="gray.700" fontSize="sm">
                      API URL
                    </Text>
                    <Flex gap={2}>
                      <Input
                        value={selectedReportDetails.apiUrl || 'N/A'}
                        readOnly
                        size="md"
                        fontFamily="monospace"
                        fontSize="sm"
                        bg="gray.50"
                        borderWidth={2}
                      />
                      <Button
                        size="md"
                        colorScheme="blue"
                        onClick={() => handleCopyToClipboard(selectedReportDetails.apiUrl || '')}
                      >
                        <Icon as={FiCopy} />
                      </Button>
                    </Flex>
                  </Box>

                  {/* API Secret */}
                  <Box>
                    <Text fontWeight="semibold" mb={2} color="gray.700" fontSize="sm">
                      API Secret
                    </Text>
                    <Flex gap={2}>
                      <Input
                        value={selectedReportDetails.apiSecret || 'N/A'}
                        readOnly
                        type="text"
                        size="md"
                        fontFamily="monospace"
                        fontSize="sm"
                        bg="gray.50"
                        borderWidth={2}
                      />
                      <Button
                        size="md"
                        colorScheme="purple"
                        onClick={() => handleCopyToClipboard(selectedReportDetails.apiSecret || '')}
                      >
                        <Icon as={FiCopy} />
                      </Button>
                    </Flex>
                  </Box>

                  {/* Full Response */}
                  <Box>
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="semibold" color="gray.700" fontSize="sm">
                        Full API Response
                      </Text>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => handleCopyToClipboard(JSON.stringify(selectedReportDetails, null, 2))}
                      >
                        <Icon as={FiCopy} mr={1} />
                        Copy JSON
                      </Button>
                    </Flex>
                    <Box
                      bg="gray.900"
                      p={4}
                      borderRadius="md"
                      maxH="400px"
                      overflowY="auto"
                    >
                      <Code
                        as="pre"
                        color="green.300"
                        bg="transparent"
                        fontSize="xs"
                        fontFamily="monospace"
                        whiteSpace="pre-wrap"
                        wordBreak="break-all"
                      >
                        {JSON.stringify(selectedReportDetails, null, 2)}
                      </Code>
                    </Box>
                  </Box>
                </Stack>
              ) : (
                <Text color="gray.600">No details available</Text>
              )}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </DashboardLayout>
  )
}

export default ReportsList
