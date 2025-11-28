import { createContext, useContext, useState, useEffect,} from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { orgsApi, usersApi } from '../services/api'

interface User {
  userId?: number
  userEmail: string
  auth0Id: string
  name?: string
  picture?: string
  orgId?: string  // Auth0 organization ID (e.g., org_3FeB8nxuRQZSR3yB)
  orgDbId?: number  // Database organization ID (numeric)
  orgName?: string
  role?: 'ADMIN' | 'MEMBER'
}

interface AuthContextType {
  user: User | null
  accessToken: string | null
  idToken: string | null
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  isLoading: boolean
  getAccessToken: () => Promise<string>
  getIdToken: () => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: any
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    user: auth0User,
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0()

  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [idToken, setIdToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      console.log('AuthContext - auth0IsLoading:', auth0IsLoading)
      console.log('AuthContext - auth0IsAuthenticated:', auth0IsAuthenticated)
      console.log('AuthContext - auth0User:', auth0User)

      if (auth0IsLoading) {
        return
      }

      if (auth0IsAuthenticated && auth0User) {
        // Get ID token first to extract org info
        let orgId: string | undefined
        let orgName: string | undefined
        let role: 'ADMIN' | 'MEMBER' | undefined

        try {
          console.log('🔑 Attempting to get ID token...')
          const idTokenClaims = await getIdTokenClaims()
          if (idTokenClaims?.__raw) {
            console.log('✅ ID token retrieved:', idTokenClaims.__raw.substring(0, 20) + '...')
            setIdToken(idTokenClaims.__raw)
            localStorage.setItem('auth0_id_token', idTokenClaims.__raw)
            console.log('✅ ID token stored in localStorage')

            // Extract organization info and role from ID token claims
            console.log('📋 ID token claims:', idTokenClaims)
            // Try both camelCase and snake_case
            orgId = (idTokenClaims as any).orgId || (idTokenClaims as any).org_id
            orgName = (idTokenClaims as any).orgName || (idTokenClaims as any).org_name
            role = (idTokenClaims as any).role || (idTokenClaims as any)['https://odyssey.com/role']
            console.log('🏢 Organization from token - ID:', orgId, 'Name:', orgName)
            console.log('👤 Role from token:', role)
          }
        } catch (error) {
          console.error('❌ FAILED to get ID token:', error)
          localStorage.removeItem('auth0_id_token')
        }

        // Fetch the numeric org ID from the database
        let orgDbId: number | undefined
        if (orgId) {
          try {
            const orgResponse = await orgsApi.getByAuth0Id(orgId)
            orgDbId = (orgResponse as any).result?.id || orgResponse.data?.id
            console.log('✅ Org DB ID fetched:', orgDbId)
          } catch (error) {
            console.error('❌ Failed to fetch org DB ID:', error)
          }
        }

        // Check if user exists in database, if not save them
        let userId: number | undefined
        if (auth0User.email && auth0User.sub && orgId) {
          try {
            console.log('🔍 Checking if user exists in database...')
            const userResponse = await usersApi.getByAuth0Id(auth0User.sub)
            userId = (userResponse as any).result?.id || userResponse.data?.id
            console.log('✅ User exists in database with ID:', userId)
          } catch (error) {
            // User doesn't exist, save them
            console.log('📝 User not found in database, saving user...')
            try {
              const savedUserResponse = await usersApi.inviteUser({
                orgAuth0Id: orgId,
                userEmail: auth0User.email,
                userAuth0Id: auth0User.sub,
                userRole: role || 'MEMBER',
              })
              userId = (savedUserResponse as any).result?.id || savedUserResponse.data?.id
              console.log('✅ User saved to database with ID:', userId)
            } catch (saveError) {
              console.error('❌ Failed to save user to database:', saveError)
            }
          }
        }

        // Map Auth0 user to our User interface with org info
        const mappedUser: User = {
          userId: userId,
          userEmail: auth0User.email || '',
          auth0Id: auth0User.sub || '',
          name: auth0User.name,
          picture: auth0User.picture,
          orgId: orgId,
          orgDbId: orgDbId,
          orgName: orgName,
          role: role,
        }

        setUser(mappedUser)
        console.log('User set with org info:', mappedUser)

        // Try to get access token
        try {
          console.log('🔑 Attempting to get access token...')
          const token = await getAccessTokenSilently()
          console.log('✅ Access token retrieved:', token.substring(0, 20) + '...')
          setAccessToken(token)
          localStorage.setItem('auth0_access_token', token)
          console.log('✅ Access token stored in localStorage')
        } catch (error) {
          console.error('❌ FAILED to get access token:', error)
          console.error('Error details:', JSON.stringify(error, null, 2))
          localStorage.removeItem('auth0_access_token')
          console.warn('⚠️ Removed access token from localStorage due to error')
        }
      } else {
        setUser(null)
        setAccessToken(null)
        setIdToken(null)
      }

      setIsLoading(false)
      console.log('AuthContext - isLoading set to false')
    }

    initAuth()
  }, [auth0IsAuthenticated, auth0User, auth0IsLoading, getAccessTokenSilently, getIdTokenClaims])

  const login = () => {
    loginWithRedirect()
  }

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
    setUser(null)
    setAccessToken(null)
    setIdToken(null)
    // Clear ALL localStorage data
    localStorage.clear()
    console.log('✅ All localStorage cleared on logout')
  }

  const getAccessToken = async (): Promise<string> => {
    try {
      const token = await getAccessTokenSilently()
      setAccessToken(token)
      localStorage.setItem('auth0_access_token', token)
      return token
    } catch (error) {
      console.error('Error getting access token:', error)
      localStorage.removeItem('auth0_access_token')
      throw error
    }
  }

  const getIdToken = async (): Promise<string> => {
    try {
      const idTokenClaims = await getIdTokenClaims()
      if (idTokenClaims?.__raw) {
        setIdToken(idTokenClaims.__raw)
        localStorage.setItem('auth0_id_token', idTokenClaims.__raw)
        return idTokenClaims.__raw
      }
      throw new Error('ID token not available')
    } catch (error) {
      console.error('Error getting ID token:', error)
      localStorage.removeItem('auth0_id_token')
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    accessToken,
    idToken,
    isAuthenticated: auth0IsAuthenticated && !!user,
    login,
    logout,
    isLoading,
    getAccessToken,
    getIdToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
