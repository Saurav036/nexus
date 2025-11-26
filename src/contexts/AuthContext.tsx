import { createContext, useContext, useState, useEffect,} from 'react'
import { useAuth0 } from '@auth0/auth0-react'

interface User {
  userId?: number
  userEmail: string
  auth0Id: string
  name?: string
  picture?: string
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
        // Map Auth0 user to our User interface
        const mappedUser: User = {
          userEmail: auth0User.email || '',
          auth0Id: auth0User.sub || '',
          name: auth0User.name,
          picture: auth0User.picture,
        }

        setUser(mappedUser)
        console.log('User set:', mappedUser)

        // Try to get access token and ID token
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

        // Get ID token
        try {
          console.log('🔑 Attempting to get ID token...')
          const idTokenClaims = await getIdTokenClaims()
          if (idTokenClaims?.__raw) {
            console.log('✅ ID token retrieved:', idTokenClaims.__raw.substring(0, 20) + '...')
            setIdToken(idTokenClaims.__raw)
            localStorage.setItem('auth0_id_token', idTokenClaims.__raw)
            console.log('✅ ID token stored in localStorage')
          }
        } catch (error) {
          console.error('❌ FAILED to get ID token:', error)
          localStorage.removeItem('auth0_id_token')
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
