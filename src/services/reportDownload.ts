import axios from 'axios'

export interface DownloadReportRequest {
  reportParameters: any[]
}

export const downloadReport = async (
  apiUrl: string,
  apiSecret: string,
  reportParameters: any[] = []
): Promise<void> => {
  try {
    console.log('📥 Downloading report from:', apiUrl)
    console.log('🔑 Using API secret:', apiSecret?.substring(0, 10) + '...')
    console.log('📋 Report parameters:', reportParameters)

    const response = await axios.post(
      apiUrl,
      {
        reportParameters,
      },
      {
        headers: {
          'X-Nexus-Auth': apiSecret,
          'Content-Type': 'application/json',
        },
        responseType: 'blob', // Get binary data as blob
      }
    )

    console.log('✅ Report API called successfully')
    console.log('📄 Response content-type:', response.headers['content-type'])

    // Determine file extension based on content-type
    const contentType = response.headers['content-type'] || ''
    let extension = 'pdf' // default
    let mimeType = 'application/pdf'

    if (contentType.includes('csv') || contentType.includes('text/csv')) {
      extension = 'csv'
      mimeType = 'text/csv'
    } else if (contentType.includes('excel') || contentType.includes('spreadsheet') || contentType.includes('xlsx')) {
      extension = 'xlsx'
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    } else if (contentType.includes('pdf')) {
      extension = 'pdf'
      mimeType = 'application/pdf'
    } else if (contentType.includes('png')) {
      extension = 'png'
      mimeType = 'image/png'
    }

    // Extract filename from Content-Disposition header or generate one
    const contentDisposition = response.headers['content-disposition']
    let filename = `report_${new Date().getTime()}.${extension}`

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '')
      }
    }

    // Create blob with correct MIME type
    const blob = new Blob([response.data], { type: mimeType })

    // Create download link and trigger download
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)

    console.log('✅ Report downloaded successfully:', filename)
  } catch (error) {
    console.error('❌ Error downloading report:', error)
    throw error
  }
}
