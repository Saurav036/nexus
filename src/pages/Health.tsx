import { useState, useEffect } from 'react'

interface HealthStatus {
  status: string
  info?: {
    'ots-api'?: { status: string }
    'ots-db'?: { status: string }
  }
  error?: Record<string, unknown>
  details?: {
    'ots-api'?: { status: string }
    'ots-db'?: { status: string }
  }
}

export default function Health() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchHealth = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch('/api/health')
      // const data = await response.json()
      // setHealth(data)
      setHealth({
        status: 'ok',
        info: {
          'ots-api': { status: 'up' },
          'ots-db': { status: 'up' }
        }
      })
    } catch (err) {
      setError('Failed to fetch health status')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ok':
      case 'up':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'error':
      case 'down':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  if (loading && !health) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">System Health</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-lg font-bold text-gray-900">Overall Status:</p>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(health?.status || 'unknown')}`}
            >
              {health?.status?.toUpperCase() || 'UNKNOWN'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {health?.info && Object.entries(health.info).map(([key, value]) => (
            <div key={key} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">{key}</p>
                  <p className="text-gray-600">Service health check</p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(value.status)}`}
                >
                  {value.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}

          {health?.details && Object.entries(health.details).map(([key, value]) => (
            <div key={key} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900 mb-1">{key}</p>
                  <p className="text-gray-600">Service health check</p>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadgeClass(value.status)}`}
                >
                  {value.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-500 mt-6 text-sm">
          Auto-refreshing every 30 seconds
        </p>
      </div>
    </div>
  )
}
