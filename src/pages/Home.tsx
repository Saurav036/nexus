import { Link } from 'react-router-dom'
import { FiUsers, FiShield, FiActivity } from 'react-icons/fi'
import { SiAuth0 } from 'react-icons/si'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Odyssey Tableau Mailer
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          API Management Dashboard
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/users">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-3">
                <FiUsers className="w-6 h-6 text-purple-500" />
                <h2 className="text-xl font-semibold">Users</h2>
              </div>
              <p className="text-gray-600">
                Manage user accounts, create, update, and delete users
              </p>
            </div>
          </Link>

          <Link to="/auth/check-email">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-3">
                <FiShield className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-semibold">Auth</h2>
              </div>
              <p className="text-gray-600">
                Check email authentication and validate user existence
              </p>
            </div>
          </Link>

          <Link to="/auth0/organizations">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-3">
                <SiAuth0 className="w-6 h-6 text-purple-500" />
                <h2 className="text-xl font-semibold">Auth0</h2>
              </div>
              <p className="text-gray-600">
                Manage Auth0 organizations and tenant settings
              </p>
            </div>
          </Link>

          <Link to="/health">
            <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="flex items-center gap-3 mb-3">
                <FiActivity className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold">Health</h2>
              </div>
              <p className="text-gray-600">
                Check API and database health status
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
