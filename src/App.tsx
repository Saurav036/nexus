import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ProtectedRoute as RoleProtectedRoute } from './components/auth/ProtectedRoute'
import { Toaster } from './components/ui/toaster'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Callback from './pages/Auth/Callback'
import VerifyEmail from './pages/Auth/VerifyEmail'
import SignupEmail from './pages/Auth/SignupEmail'
import SignupUserExists from './pages/Auth/SignupUserExists'
import SignupPublicDomain from './pages/Auth/SignupPublicDomain'
import SignupOrgExists from './pages/Auth/SignupOrgExists'
import SignupCreateOrg from './pages/Auth/SignupCreateOrg'

// Dashboard
import Dashboard from './pages/Dashboard/Dashboard'
import UsersList from './pages/Dashboard/Users/UsersList'
import UserForm from './pages/Dashboard/Users/UserForm'
import OrganizationsList from './pages/Dashboard/Organizations/OrganizationsList'
import ConnectionsList from './pages/Dashboard/Connections/ConnectionsList'
import ConnectionForm from './pages/Dashboard/Connections/ConnectionForm'
import ReportsList from './pages/Dashboard/Reports/ReportsList'
import ReportForm from './pages/Dashboard/Reports/ReportForm'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Auth/Signup Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/signup" element={<SignupEmail />} />
          <Route path="/signup/user-exists" element={<SignupUserExists />} />
          <Route path="/signup/public-domain" element={<SignupPublicDomain />} />
          <Route path="/signup/org-exists" element={<SignupOrgExists />} />
          <Route path="/signup/create-org" element={<SignupCreateOrg />} />

          {/* Dashboard Routes - Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['ADMIN', 'MEMBER']}>
                  <Dashboard />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Users - Admin Only */}
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                  <UsersList />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users/create"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                  <UserForm mode="create" />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users/:id/edit"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                  <UserForm mode="edit" />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Organizations - Admin Only */}
          <Route
            path="/dashboard/organizations"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                  <OrganizationsList />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Connections - Admin Only */}
          <Route
            path="/dashboard/connections"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                  <ConnectionsList />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/connections/create"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                  <ConnectionForm mode="create" />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/connections/:id/edit"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                  <ConnectionForm mode="edit" />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* Reports - Both Admin and Member */}
          <Route
            path="/dashboard/reports"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['ADMIN', 'MEMBER']}>
                  <ReportsList />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reports/create"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['ADMIN', 'MEMBER']}>
                  <ReportForm mode="create" />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reports/:id/edit"
            element={
              <ProtectedRoute>
                <RoleProtectedRoute allowedRoles={['ADMIN', 'MEMBER']}>
                  <ReportForm mode="edit" />
                </RoleProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* TODO: Add more dashboard routes for Organizations, etc. */}

          {/* Catch-all route - redirect to signup/login page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  )
}

export default App



//https://sproutlogix-dev.us.auth0.com/authorize?invitation=FjxEbRrFX2WT4xwtBLxqWTmONb9LEmqj&organization=org_QXVCTyULY134VmhD&organization_name=Saurav&response_type=code&client_id=x7WcBOWccngGIxkQMOPsDrE5UFgEI8LF