import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface User {
  id: number
  email: string
  firstName?: string
  lastName?: string
}

export default function UserEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [formData, setFormData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
      // setFormData(data.result)
      setFormData({ id: Number(id), email: '', firstName: '', lastName: '' })
    } catch (err) {
      setError('Failed to fetch user')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    try {
      setSaving(true)
      setError(null)
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/users/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      // if (response.ok) {
      //   navigate(`/users/${id}`)
      // }
      console.log('Update user:', formData)
    } catch (err) {
      setError('Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">User not found</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit User</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
                placeholder="Doe"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update User'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/users/${id}`)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
