import { useState } from 'react'

export default function CheckEmail() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ exists: boolean; message: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      setResult(null)
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/check-email', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // })
      // const data = await response.json()
      // if (response.ok) {
      //   setResult({ exists: true, message: data.message })
      // } else {
      //   setResult({ exists: false, message: 'User not found' })
      // }
      console.log('Check email:', email)
    } catch (err) {
      setError('Failed to check email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Email</h1>
        <p className="text-gray-600 mb-6">
          Verify if a user with this email exists in the system
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {result && (
          <div
            className={`${
              result.exists
                ? 'bg-green-100 border border-green-400 text-green-700'
                : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
            } px-4 py-3 rounded relative mb-4`}
            role="alert"
          >
            <span className="block sm:inline">{result.message}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to check"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Check Email'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
