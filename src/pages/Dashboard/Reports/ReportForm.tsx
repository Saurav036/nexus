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

interface ReportFormProps {
  mode: 'create' | 'edit'
}

type FileFormat = 'pdf' | 'png' | 'csv'
type Orientation = 'portrait' | 'landscape'

const ReportForm = ({ mode }: ReportFormProps) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [loadingWorkbooks, setLoadingWorkbooks] = useState(false)
  const [loadingViews, setLoadingViews] = useState(false)
  const [connections, setConnections] = useState<Connection[]>([])
  const [workbooks, setWorkbooks] = useState<Array<{ id: string; name: string }>>([])
  const [views, setViews] = useState<Array<{ id: string; name: string }>>([])
  const [fileFormat, setFileFormat] = useState<FileFormat>('pdf')
  const [orientation, setOrientation] = useState<Orientation>('portrait')
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
    fetchConnections()
    if (mode === 'edit' && id) {
      fetchReport(parseInt(id))
    }
  }, [mode, id])

  // Fetch workbooks when connection changes
  useEffect(() => {
    if (formData.connectionId) {
      fetchWorkbooks(parseInt(formData.connectionId))
    } else {
      setWorkbooks([])
      setViews([])
      setFormData(prev => ({ ...prev, workbookId: '', workbookName: '', viewId: '', viewName: '' }))
    }
  }, [formData.connectionId])

  // Fetch views when workbook changes
  useEffect(() => {
    if (formData.connectionId && formData.workbookId) {
      fetchViews(parseInt(formData.connectionId), formData.workbookId)
    } else {
      setViews([])
      setFormData(prev => ({ ...prev, viewId: '', viewName: '' }))
    }
  }, [formData.workbookId])

  const fetchConnections = async () => {
    try {
      const response:any = await connectionsApi.getAll()
      setConnections(response.data || response.result || [])
    } catch (error) {
      toaster.create({
        title: 'Error loading connections',
        description: error instanceof ApiError ? error.message : 'Failed to load connections',
        type: 'error',
        duration: 5000,
      })
    }
  }

  const fetchWorkbooks = async (connectionId: number) => {
    try {
      setLoadingWorkbooks(true)
      const response = await tableauApi.getWorkbooks(connectionId)
      console.log('Workbooks API response:', response)
      // Handle both wrapped (response.result) and direct array responses
      const workbooksData = Array.isArray(response) ? response : (response.result || [])
      console.log('Workbooks data:', workbooksData)
      setWorkbooks(workbooksData)
    } catch (error) {
      console.error('Error fetching workbooks:', error)
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
      const response = await tableauApi.getWorkbookViews(connectionId, workbookId)
      console.log('Views API response:', response)
      // Handle both wrapped (response.result) and direct array responses
      const viewsData = Array.isArray(response) ? response : (response.result || [])
      console.log('Views data:', viewsData)
      setViews(viewsData)
    } catch (error) {
      console.error('Error fetching views:', error)
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
      const response:any = await reportsApi.getById(reportId)
      console.log('Report API response:', response)
      const report = response.data || response.result

      setFileFormat(report.fileFormat as FileFormat)
      setOrientation(report.orientation as Orientation)

      setFormData({
        connectionId: report.connectionId?.toString() || '',
        workbookName: report.workbookName || '',
        viewName: report.viewName || '',
        workbookId: report.workbookId || '',
        viewId: report.viewId || '',
        apiKey: report.apiKey || '',
        apiSecret: '',
        parameters: JSON.stringify(report.parameters || {}, null, 2),
      })
    } catch (error) {
      toaster.create({
        title: 'Error loading report',
        description: error instanceof ApiError ? error.message : 'Failed to load report',
        type: 'error',
        duration: 5000,
      })
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
        const reportData: CreateReportDto = {
          connectionId: parseInt(formData.connectionId),
          workbookName: formData.workbookName,
          viewName: formData.viewName,
          workbookId: formData.workbookId,
          viewId: formData.viewId,
          fileFormat: fileFormat,
          orientation: orientation,
          apiKey: '',
          apiSecret: '',
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
