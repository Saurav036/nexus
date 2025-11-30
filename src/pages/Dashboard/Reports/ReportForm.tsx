import { useState, useEffect, useRef } from 'react'
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
  Textarea,
  Spinner,
} from '@chakra-ui/react'
import { RadioGroup } from '../../../components/ui/radio'
import { FiSave, FiArrowLeft } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { DashboardLayout } from '../../../components/layout/DashboardLayout'
import { reportsApi, connectionsApi, tableauApi, ApiError } from '../../../services/api'
import type { Report, CreateReportDto, UpdateReportDto, Connection } from '../../../types/api'
import { toaster } from '../../../components/ui/toaster'
import { useAuth } from '../../../contexts/AuthContext'

interface ReportFormProps {
  mode: 'create' | 'edit'
}

type FileFormat = 'pdf' | 'png' | 'csv'
type Orientation = 'portrait' | 'landscape'

const ReportForm = ({ mode }: ReportFormProps) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [loadingWorkbooks, setLoadingWorkbooks] = useState(false)
  const [loadingViews, setLoadingViews] = useState(false)
  const [connections, setConnections] = useState<Connection[]>([])
  const [workbooks, setWorkbooks] = useState<Array<{ id: string; name: string }>>([])
  const [views, setViews] = useState<Array<{ id: string; name: string }>>([])
  const [fileFormat, setFileFormat] = useState<FileFormat>('pdf')
  const [orientation, setOrientation] = useState<Orientation>('portrait')
  const isFetchingReport = useRef(false)
  const [formData, setFormData] = useState({
    connectionId: '',
    workbookName: '',
    viewName: '',
    workbookId: '',
    viewId: '',
    apiKey: '',
    apiSecret: '',
    parameters: '{}',
  })

  useEffect(() => {
    // Only fetch connections in create mode
    // In edit mode, we get the connection from the report API response
    if (mode === 'create') {
      fetchConnections()
    } else if (mode === 'edit' && id) {
      fetchReport(parseInt(id))
    }
  }, [mode, id])

  // Fetch workbooks when connection changes (but not during initial edit load)
  useEffect(() => {
    // Skip if we're currently fetching a report (fetchReport handles it manually)
    if (isFetchingReport.current) {
      console.log('⏭️ Skipping workbooks useEffect - fetchReport is in progress')
      return
    }

    if (formData.connectionId) {
      console.log('🔄 useEffect: Fetching workbooks for connection:', formData.connectionId)
      fetchWorkbooks(formData.connectionId)
    } else {
      setWorkbooks([])
      setViews([])
      // Only clear workbook/view if not in edit mode or if edit mode has finished loading
      if (mode === 'create' || (mode === 'edit' && !loading)) {
        setFormData(prev => ({ ...prev, workbookId: '', workbookName: '', viewId: '', viewName: '' }))
      }
    }
  }, [formData.connectionId, mode])

  // Fetch views when workbook changes (but not during initial edit load)
  useEffect(() => {
    // Skip if we're currently fetching a report (fetchReport handles it manually)
    if (isFetchingReport.current) {
      console.log('⏭️ Skipping views useEffect - fetchReport is in progress')
      return
    }

    if (formData.connectionId && formData.workbookId) {
      console.log('🔄 useEffect: Fetching views for workbook:', formData.workbookId)
      fetchViews(parseInt(formData.connectionId), formData.workbookId)
    } else {
      setViews([])
      // Only clear view if not in edit mode or if edit mode has finished loading
      if (mode === 'create' || (mode === 'edit' && !loading)) {
        setFormData(prev => ({ ...prev, viewId: '', viewName: '' }))
      }
    }
  }, [formData.workbookId, mode])

  const fetchConnections = async () => {
    if (!user?.orgDbId) {
      console.log('No orgDbId found')
      return
    }

    try {
      const response = await connectionsApi.getByOrg(user.orgDbId)
      console.log('Connections response:', response)
      setConnections(response.data || [])
    } catch (error) {
      console.error('Error fetching connections:', error)
      toaster.create({
        title: 'Error loading connections',
        description: error instanceof ApiError ? error.message : 'Failed to load connections',
        type: 'error',
        duration: 5000,
      })
    }
  }

  const fetchWorkbooks = async (connectionId: any) => {
    try {
      setLoadingWorkbooks(true)
      console.log('🔄 Fetching workbooks for connection:', connectionId)
      const response = await tableauApi.getWorkbooks(connectionId)
      console.log('📦 Workbooks API full response:', response)
      console.log('📦 Response type:', typeof response)
      console.log('📦 Is Array?:', Array.isArray(response))

      // Handle different response formats
      let workbooksData = []
      if (Array.isArray(response)) {
        workbooksData = response
      } else if (response && typeof response === 'object' && 'data' in response) {
        workbooksData = response.data || []
      } else if (response && typeof response === 'object' && 'result' in response) {
        workbooksData = (response as any).result || []
      }

      console.log('📚 Parsed workbooks data:', workbooksData)
      console.log('📚 Workbooks count:', workbooksData.length)
      setWorkbooks(workbooksData)
    } catch (error) {
      console.error('❌ Error fetching workbooks:', error)
      console.error('❌ Error details:', error instanceof ApiError ? error.data : error)
      toaster.create({
        title: 'Error loading workbooks',
        description: error instanceof ApiError ? error.message : 'Failed to load workbooks from Tableau',
        type: 'error',
        duration: 5000,
      })
      setWorkbooks([])
    } finally {
      setLoadingWorkbooks(false)
    }
  }

  const fetchViews = async (connectionId: number, workbookId: string) => {
    try {
      setLoadingViews(true)
      console.log('🔄 Fetching views for connection:', connectionId, 'workbook:', workbookId)
      const response = await tableauApi.getWorkbookViews(connectionId, workbookId)
      console.log('📄 Views API full response:', response)
      console.log('📄 Response type:', typeof response)
      console.log('📄 Is Array?:', Array.isArray(response))

      // Handle different response formats
      let viewsData = []
      if (Array.isArray(response)) {
        viewsData = response
      } else if (response && typeof response === 'object' && 'data' in response) {
        viewsData = response.data || []
      } else if (response && typeof response === 'object' && 'result' in response) {
        viewsData = (response as any).result || []
      }

      console.log('👁️ Parsed views data:', viewsData)
      console.log('👁️ Views count:', viewsData.length)
      setViews(viewsData)
    } catch (error) {
      console.error('❌ Error fetching views:', error)
      console.error('❌ Error details:', error instanceof ApiError ? error.data : error)
      toaster.create({
        title: 'Error loading views',
        description: error instanceof ApiError ? error.message : 'Failed to load views from Tableau',
        type: 'error',
        duration: 5000,
      })
      setViews([])
    } finally {
      setLoadingViews(false)
    }
  }

  const fetchReport = async (reportId: number) => {
    try {
      setLoading(true)
      isFetchingReport.current = true
      console.log('🔍 Fetching report with ID:', reportId)

      const response = await reportsApi.getById(reportId)
      console.log('📝 Report API raw response:', JSON.stringify(response, null, 2))

      // Extract report from different possible response structures
      let report: any = null

      if (response && typeof response === 'object') {
        // Check for 'result' field (NestJS standard with TransformInterceptor)
        if ('result' in response && response.result) {
          report = response.result
          console.log('📝 Found report in response.result')
        }
        // Check for 'data' field
        else if ('data' in response && response.data) {
          report = response.data
          console.log('📝 Found report in response.data')
        }
        // Direct response
        else if ('id' in response && 'connectionId' in response) {
          report = response
          console.log('📝 Using direct response as report')
        }
      }

      console.log('📝 Extracted report object:', report)

      // Validate report data
      if (!report) {
        throw new Error('No report data found in response')
      }

      if (!report.id) {
        throw new Error('Report ID missing from response')
      }

      if (!report.connectionId) {
        throw new Error('Connection ID missing from report - cannot load workbooks/views')
      }

      // Set file format and orientation with validation
      const validFileFormats: FileFormat[] = ['pdf', 'png', 'csv']
      const validOrientations: Orientation[] = ['portrait', 'landscape']

      if (validFileFormats.includes(report.fileFormat)) {
        setFileFormat(report.fileFormat as FileFormat)
      } else {
        console.warn('Invalid file format, defaulting to pdf:', report.fileFormat)
        setFileFormat('pdf')
      }

      if (validOrientations.includes(report.orientation)) {
        setOrientation(report.orientation as Orientation)
      } else {
        console.warn('Invalid orientation, defaulting to portrait:', report.orientation)
        setOrientation('portrait')
      }

      // Use connection data from report response (no need for separate API call)
      if (report.connection) {
        console.log('✅ Using connection from report response:', report.connection)
        setConnections([report.connection])
      } else {
        console.warn('⚠️ No connection data in report response')
      }

      // Set form data
      const newFormData = {
        connectionId: report.connectionId?.toString() || '',
        workbookName: report.workbookName || '',
        viewName: report.viewName || '',
        workbookId: report.workbookId || '',
        viewId: report.viewId || '',
        apiKey: report.apiKey || '',
        apiSecret: '',
        parameters: report.parameters
          ? (typeof report.parameters === 'string'
              ? report.parameters
              : JSON.stringify(report.parameters, null, 2))
          : '{}',
      }

      // Manually trigger workbooks and views fetch for edit mode BEFORE setting form data
      if (report.connectionId) {
        console.log('🔄 Edit mode: Fetching workbooks for connection ID:', report.connectionId)
        try {
          await fetchWorkbooks(report.connectionId)
          console.log('✅ Workbooks loaded successfully')
        } catch (error) {
          console.error('❌ Failed to load workbooks:', error)
        }

        if (report.workbookId) {
          console.log('🔄 Edit mode: Fetching views for workbook ID:', report.workbookId)
          try {
            await fetchViews(report.connectionId, report.workbookId)
            console.log('✅ Views loaded successfully')
          } catch (error) {
            console.error('❌ Failed to load views:', error)
          }
        }
      }

      console.log('✅ Setting form data:', newFormData)
      setFormData(newFormData)

      console.log('✅ Report loaded successfully')

      // Mark fetch as complete - allow useEffects to respond to future changes
      setTimeout(() => {
        isFetchingReport.current = false
        console.log('✅ fetchReport complete - useEffects will now respond to changes')
      }, 100)
    } catch (error) {
      console.error('❌ CRITICAL Error in fetchReport:', error)
      console.error('❌ Error type:', error instanceof Error ? error.constructor.name : typeof error)
      console.error('❌ Error message:', error instanceof Error ? error.message : String(error))
      console.error('❌ Full error object:', error)

      toaster.create({
        title: 'Error loading report',
        description: error instanceof Error ? error.message : 'Failed to load report. Check console for details.',
        type: 'error',
        duration: 10000,
      })

      isFetchingReport.current = false
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.connectionId || !formData.workbookName || !formData.viewName || !formData.workbookId || !formData.viewId) {
      toaster.create({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        type: 'warning',
        duration: 3000,
      })
      return
    }

    // Validate parameters JSON
    let parsedParameters
    try {
      parsedParameters = JSON.parse(formData.parameters)
    } catch (error) {
      toaster.create({
        title: 'Validation Error',
        description: 'Parameters must be valid JSON',
        type: 'warning',
        duration: 3000,
      })
      return
    }

    try {
      setLoading(true)

      if (mode === 'create') {
        const reportData: any = {
          connectionId: parseInt(formData.connectionId),
          workbookName: formData.workbookName,
          viewName: formData.viewName,
          workbookId: formData.workbookId,
          viewId: formData.viewId,
          fileFormat: fileFormat,
          orientation: orientation,
          // apiKey: '',
          // apiSecret: '',
          parameters: parsedParameters,
        }

        await reportsApi.create(reportData)
        toaster.create({
          title: 'Report created',
          type: 'success',
          duration: 3000,
        })
      } else if (mode === 'edit' && id) {
        const updateData: UpdateReportDto = {
          connectionId: parseInt(formData.connectionId),
          workbookName: formData.workbookName,
          viewName: formData.viewName,
          workbookId: formData.workbookId,
          viewId: formData.viewId,
          fileFormat: fileFormat,
          orientation: orientation,
          // apiKey: formData.apiKey,
          // apiSecret: formData.apiSecret,
          parameters: parsedParameters,
        }

        await reportsApi.update(parseInt(id), updateData)
        toaster.create({
          title: 'Report updated',
          type: 'success',
          duration: 3000,
        })
      }

      navigate('/dashboard/reports')
    } catch (error) {
      toaster.create({
        title: `Error ${mode === 'create' ? 'creating' : 'updating'} report`,
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
      <Box maxW="800px">
        <Flex align="center" gap={3} mb={6}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard/reports')}
            color="gray.600"
            _hover={{ bg: 'gray.100' }}
          >
            <Flex align="center" gap={2}>
              <Icon as={FiArrowLeft} />
              <Text>Back</Text>
            </Flex>
          </Button>
          <Heading color="gray.900">{mode === 'create' ? 'New Report' : 'Edit Report'}</Heading>
        </Flex>

        <Box bg="white" p={6} borderRadius="lg" borderWidth={1}>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  Connection <Text as="span" color="red.500">*</Text>
                </Text>
                <Box
                  as="select"
                  {...{ value: formData.connectionId } as any}
                  onChange={(e: any) => setFormData({ ...formData, connectionId: e.target.value })}
                  required
                  size="lg"
                  borderWidth={2}
                  borderRadius="md"
                  p={3}
                  w="100%"
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                >
                  <option value="">Select a connection</option>
                  {connections.map((conn) => (
                    <option key={conn.id} value={conn.id}>
                      {conn.name} - {conn.server}
                    </option>
                  ))}
                </Box>
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  Workbook <Text as="span" color="red.500">*</Text>
                </Text>
                <Box position="relative">
                  <Box
                    as="select"
                    {...{ value: formData.workbookId } as any}
                    onChange={(e: any) => {
                      const selectedWorkbook = workbooks.find(w => w.id === e.target.value)
                      setFormData({
                        ...formData,
                        workbookId: e.target.value,
                        workbookName: selectedWorkbook?.name || ''
                      })
                    }}
                    required
                    disabled={!formData.connectionId || loadingWorkbooks}
                    size="lg"
                    borderWidth={2}
                    borderRadius="md"
                    p={3}
                    w="100%"
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                  >
                    <option value="">
                      {loadingWorkbooks ? 'Loading workbooks...' : 'Select a workbook'}
                    </option>
                    {/* Show current workbook if in edit mode and workbooks haven't loaded yet */}
                    {mode === 'edit' && formData.workbookId && formData.workbookName &&
                     !workbooks.find(w => w.id === formData.workbookId) && (
                      <option value={formData.workbookId}>
                        {formData.workbookName}
                      </option>
                    )}
                    {workbooks.map((workbook) => (
                      <option key={workbook.id} value={workbook.id}>
                        {workbook.name}
                      </option>
                    ))}
                  </Box>
                  {loadingWorkbooks && (
                    <Spinner
                      size="sm"
                      position="absolute"
                      right={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="purple.500"
                    />
                  )}
                </Box>
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  View <Text as="span" color="red.500">*</Text>
                </Text>
                <Box position="relative">
                  <Box
                    as="select"
                    {...{ value: formData.viewId } as any}
                    onChange={(e: any) => {
                      const selectedView = views.find(v => v.id === e.target.value)
                      setFormData({
                        ...formData,
                        viewId: e.target.value,
                        viewName: selectedView?.name || ''
                      })
                    }}
                    required
                    disabled={!formData.workbookId || loadingViews}
                    size="lg"
                    borderWidth={2}
                    borderRadius="md"
                    p={3}
                    w="100%"
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                  >
                    <option value="">
                      {loadingViews ? 'Loading views...' : 'Select a view'}
                    </option>
                    {/* Show current view if in edit mode and views haven't loaded yet */}
                    {mode === 'edit' && formData.viewId && formData.viewName &&
                     !views.find(v => v.id === formData.viewId) && (
                      <option value={formData.viewId}>
                        {formData.viewName}
                      </option>
                    )}
                    {views.map((view) => (
                      <option key={view.id} value={view.id}>
                        {view.name}
                      </option>
                    ))}
                  </Box>
                  {loadingViews && (
                    <Spinner
                      size="sm"
                      position="absolute"
                      right={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="purple.500"
                    />
                  )}
                </Box>
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  File Format <Text as="span" color="red.500">*</Text>
                </Text>
                <RadioGroup.Root value={fileFormat} onValueChange={(e) => setFileFormat(e.value as FileFormat)}>
                  <Stack direction="row" gap={6}>
                    <RadioGroup.Item value="pdf">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText fontSize="sm">PDF</RadioGroup.ItemText>
                    </RadioGroup.Item>
                    <RadioGroup.Item value="png">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText fontSize="sm">PNG</RadioGroup.ItemText>
                    </RadioGroup.Item>
                    <RadioGroup.Item value="csv">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText fontSize="sm">CSV</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </Stack>
                </RadioGroup.Root>
              </Box>

              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  Orientation <Text as="span" color="red.500">*</Text>
                </Text>
                <RadioGroup.Root value={orientation} onValueChange={(e) => setOrientation(e.value as Orientation)}>
                  <Stack direction="row" gap={6}>
                    <RadioGroup.Item value="portrait">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText fontSize="sm">Portrait</RadioGroup.ItemText>
                    </RadioGroup.Item>
                    <RadioGroup.Item value="landscape">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText fontSize="sm">Landscape</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </Stack>
                </RadioGroup.Root>
              </Box>

              {/* <Flex gap={4}>
                <Box flex={1}>
                  <Text fontWeight="medium" mb={2} color="gray.700">
                    API Key <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    placeholder="api-key-123"
                    required
                    size="lg"
                    borderWidth={2}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                  />
                </Box>

                <Box flex={1}>
                  <Text fontWeight="medium" mb={2} color="gray.700">
                    API Secret <Text as="span" color="red.500">*</Text>
                  </Text>
                  <Input
                    type="password"
                    value={formData.apiSecret}
                    onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                    placeholder={mode === 'edit' ? 'Leave empty to keep current secret' : 'api-secret-123'}
                    required={mode === 'create'}
                    size="lg"
                    borderWidth={2}
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                  />
                </Box>
              </Flex> */}

              <Box>
                <Text fontWeight="medium" mb={2} color="gray.700">
                  Parameters (JSON)
                </Text>
                <Textarea
                  value={formData.parameters}
                  onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
                  placeholder='{"param1": "value1", "param2": "value2"}'
                  size="lg"
                  borderWidth={2}
                  fontFamily="monospace"
                  rows={6}
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Enter valid JSON format for report parameters
                </Text>
              </Box>

              <Flex gap={3} pt={4}>
                <Button
                  type="submit"
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: 'blue.600', boxShadow: 'lg' }}
                  size="lg"
                  h={12}
                  loading={loading}
                  disabled={loading}
                  flex={1}
                  fontSize="md"
                  transition="all 0.2s"
                >
                  <Flex align="center" gap={2}>
                    <Icon as={FiSave} />
                    <Text>{mode === 'create' ? 'Create Report' : 'Update Report'}</Text>
                  </Flex>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  h={12}
                  onClick={() => navigate('/dashboard/reports')}
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

export default ReportForm
