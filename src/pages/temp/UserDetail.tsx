import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface User {
  id: number
  email: string
  firstName?: string
  lastName?: string
  createdAt: string
  updatedAt: string
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/${id}`)
      // const data = await response.json()
      // setUser(data.result)
    } catch (err) {
      setError('Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) return

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/users/${id}`, { method: 'DELETE' })
      navigate('/users')
    } catch (err) {
      setError('Failed to delete user')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error || 'User not found'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/users/${id}/edit`)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => navigate('/users')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-bold text-gray-600 mb-1">ID</p>
              <p className="text-gray-900">{user.id}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 mb-1">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 mb-1">First Name</p>
              <p className="text-gray-900">{user.firstName || 'N/A'}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 mb-1">Last Name</p>
              <p className="text-gray-900">{user.lastName || 'N/A'}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 mb-1">Created At</p>
              <p className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-bold text-gray-600 mb-1">Updated At</p>
              <p className="text-gray-900">{new Date(user.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
