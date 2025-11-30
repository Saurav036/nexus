import axios from 'axios'
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, API_ENDPOINTS } from '../config/constants'
import type {
  ApiResponse,
  User,
  CreateUserDto,
  UpdateUserDto,
  Org,
  CreateOrgDto,
  UpdateOrgDto,
  Billing,
  CreateBillingDto,
  UpdateBillingDto,
  Connection,
  CreateConnectionDto,
  UpdateConnectionDto,
  CreateConnectionWithCredentialsDto,
  Credential,
  CreateCredentialDto,
  UpdateCredentialDto,
  Report,
  CreateReportDto,
  UpdateReportDto,
  UserOrgMap,
  CreateUserOrgMapDto,
  UpdateUserOrgMapDto,
  HealthCheck,
} from '../types/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: unknown,
    message?: string
  ) {
    super(message || 'An error occurred')
    this.name = 'ApiError'
  }
}

class ApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    // Create axios instance with base configuration
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    })

    // Request interceptor - add auth tokens to every request
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Get ID token from localStorage
        const idToken = localStorage.getItem('auth0_id_token')

        console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`)

        // Add Authorization header with ID token
        if (idToken) {
          config.headers.Authorization = `Bearer ${idToken}`
          console.log('✅ Authorization header added with ID token')
        } else {
          console.warn('⚠️ No ID token found in localStorage - API request will be unauthorized')
          console.log('localStorage keys:', Object.keys(localStorage))
        }

        return config
      },
      (error) => {
        console.error('❌ Request interceptor error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor - handle responses and errors
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
        return response
      },
      (error: AxiosError) => {
        console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data)

        if (error.response) {
          // Handle 401 Unauthorized - redirect to login
          if (error.response.status === 401) {
            console.error('🔒 Unauthorized - Redirecting to login')

            // Clear all auth-related data from localStorage
            const keysToRemove: string[] = []
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i)
              if (key && (key.startsWith('@@auth0spajs@@') || key.startsWith('auth0_'))) {
                keysToRemove.push(key)
              }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key))

            // Redirect to login page
            window.location.href = '/login'

            throw new ApiError(
              401,
              error.response.data,
              'Your session has expired. Please login again.'
            )
          }

          // Server responded with error status
          const data = error.response.data as any
          throw new ApiError(
            error.response.status,
            data,
            data.message || error.message
          )
        } else if (error.request) {
          // Request was made but no response received
          throw new ApiError(0, null, 'Network error - no response received')
        } else {
          // Something else happened
          throw new ApiError(0, null, error.message)
        }
      }
    )
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint)
    return response.data
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data)
    return response.data
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data)
    return response.data
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint)
    return response.data
  }
}

const apiService = new ApiService()

// Users API
export const usersApi = {
  getAll: (): Promise<ApiResponse<User[]>> => {
    return apiService.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS)
  },

  getById: (id: number): Promise<ApiResponse<User>> => {
    return apiService.get<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`)
  },

  getByEmail: (email: string): Promise<ApiResponse<User>> => {
    return apiService.get<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/email/${email}`)
  },

  getByAuth0Id: (auth0Id: string): Promise<ApiResponse<User>> => {
    return apiService.get<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/auth0/${auth0Id}`)
  },

  getByOrganization: (orgId: number): Promise<ApiResponse<User[]>> => {
    return apiService.get<ApiResponse<User[]>>(`${API_ENDPOINTS.USERS}/organization/${orgId}`)
  },

  create: (data: CreateUserDto): Promise<ApiResponse<User>> => {
    return apiService.post<ApiResponse<User>>(API_ENDPOINTS.USERS, data)
  },

  inviteUser: (data: {
    orgAuth0Id: string
    userEmail: string
    userAuth0Id: string
    userRole?: 'ADMIN' | 'MEMBER'
  }): Promise<ApiResponse<User>> => {
    return apiService.post<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/invite-user`, data)
  },

  update: (id: number, data: UpdateUserDto): Promise<ApiResponse<User>> => {
    return apiService.patch<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`, data)
  },

  delete: (id: number): Promise<ApiResponse<User>> => {
    return apiService.delete<ApiResponse<User>>(`${API_ENDPOINTS.USERS}/${id}`)
  },
}

// Organizations API
export const orgsApi = {
  getAll: (): Promise<ApiResponse<Org[]>> => {
    return apiService.get<ApiResponse<Org[]>>(API_ENDPOINTS.ORGS)
  },

  getById: (id: number): Promise<ApiResponse<Org>> => {
    return apiService.get<ApiResponse<Org>>(`${API_ENDPOINTS.ORGS}/${id}`)
  },

  getByDomain: (domain: string): Promise<ApiResponse<Org>> => {
    return apiService.get<ApiResponse<Org>>(`${API_ENDPOINTS.ORGS}/domain/${domain}`)
  },

  getByAuth0Id: (auth0Id: string): Promise<ApiResponse<Org>> => {
    return apiService.get<ApiResponse<Org>>(`${API_ENDPOINTS.ORGS}/auth0/${auth0Id}`)
  },

  create: (data: CreateOrgDto): Promise<ApiResponse<Org>> => {
    return apiService.post<ApiResponse<Org>>(API_ENDPOINTS.ORGS, data)
  },

  update: (id: number, data: UpdateOrgDto): Promise<ApiResponse<Org>> => {
    return apiService.patch<ApiResponse<Org>>(`${API_ENDPOINTS.ORGS}/${id}`, data)
  },

  delete: (id: number): Promise<ApiResponse<Org>> => {
    return apiService.delete<ApiResponse<Org>>(`${API_ENDPOINTS.ORGS}/${id}`)
  },
}

// Billings API
export const billingsApi = {
  getAll: (): Promise<ApiResponse<Billing[]>> => {
    return apiService.get<ApiResponse<Billing[]>>(API_ENDPOINTS.BILLINGS)
  },

  getById: (id: number): Promise<ApiResponse<Billing>> => {
    return apiService.get<ApiResponse<Billing>>(`${API_ENDPOINTS.BILLINGS}/${id}`)
  },

  create: (data: CreateBillingDto): Promise<ApiResponse<Billing>> => {
    return apiService.post<ApiResponse<Billing>>(API_ENDPOINTS.BILLINGS, data)
  },

  update: (id: number, data: UpdateBillingDto): Promise<ApiResponse<Billing>> => {
    return apiService.patch<ApiResponse<Billing>>(`${API_ENDPOINTS.BILLINGS}/${id}`, data)
  },

  delete: (id: number): Promise<ApiResponse<Billing>> => {
    return apiService.delete<ApiResponse<Billing>>(`${API_ENDPOINTS.BILLINGS}/${id}`)
  },
}

// Connections API
export const connectionsApi = {
  getAll: (): Promise<ApiResponse<Connection[]>> => {
    return apiService.get<ApiResponse<Connection[]>>(API_ENDPOINTS.CONNECTIONS)
  },

  getByOrg: (orgId: number): Promise<ApiResponse<Connection[]>> => {
    return apiService.get<ApiResponse<Connection[]>>(`${API_ENDPOINTS.CONNECTIONS}/org/${orgId}`)
  },

  getById: (id: number): Promise<ApiResponse<Connection>> => {
    return apiService.get<ApiResponse<Connection>>(`${API_ENDPOINTS.CONNECTIONS}/${id}`)
  },

  create: (data: CreateConnectionDto): Promise<ApiResponse<Connection>> => {
    return apiService.post<ApiResponse<Connection>>(API_ENDPOINTS.CONNECTIONS, data)
  },

  createWithCredentials: (data: CreateConnectionWithCredentialsDto): Promise<ApiResponse<Connection>> => {
    return apiService.post<ApiResponse<Connection>>(`${API_ENDPOINTS.CONNECTIONS}`, data)
  },

  update: (id: number, data: UpdateConnectionDto): Promise<ApiResponse<Connection>> => {
    return apiService.patch<ApiResponse<Connection>>(`${API_ENDPOINTS.CONNECTIONS}/${id}`, data)
  },

  delete: (id: number): Promise<ApiResponse<Connection>> => {
    return apiService.delete<ApiResponse<Connection>>(`${API_ENDPOINTS.CONNECTIONS}/${id}`)
  },
}

// Credentials API
export const credentialsApi = {
  getAll: (): Promise<ApiResponse<Credential[]>> => {
    return apiService.get<ApiResponse<Credential[]>>(API_ENDPOINTS.CREDENTIALS)
  },

  getById: (id: number): Promise<ApiResponse<Credential>> => {
    return apiService.get<ApiResponse<Credential>>(`${API_ENDPOINTS.CREDENTIALS}/${id}`)
  },

  create: (data: CreateCredentialDto): Promise<ApiResponse<Credential>> => {
    return apiService.post<ApiResponse<Credential>>(API_ENDPOINTS.CREDENTIALS, data)
  },

  update: (id: number, data: UpdateCredentialDto): Promise<ApiResponse<Credential>> => {
    return apiService.patch<ApiResponse<Credential>>(`${API_ENDPOINTS.CREDENTIALS}/${id}`, data)
  },

  delete: (id: number): Promise<ApiResponse<Credential>> => {
    return apiService.delete<ApiResponse<Credential>>(`${API_ENDPOINTS.CREDENTIALS}/${id}`)
  },
}

// Reports API
export const reportsApi = {
  getAll: (): Promise<ApiResponse<Report[]>> => {
    return apiService.get<ApiResponse<Report[]>>(API_ENDPOINTS.REPORTS)
  },

  getByOrg: (orgId: number): Promise<ApiResponse<Report[]>> => {
    return apiService.get<ApiResponse<Report[]>>(`${API_ENDPOINTS.REPORTS}/org/${orgId}`)
  },

  getById: (id: number): Promise<any> => {
    return apiService.get<any>(`${API_ENDPOINTS.REPORTS}/${id}`)
  },

  getApiDetailsById: (id: number): Promise<any> => {
    return apiService.get<any>(`${API_ENDPOINTS.REPORTS}/${id}/api-details`)
  },

  create: (data: CreateReportDto): Promise<ApiResponse<Report>> => {
    return apiService.post<ApiResponse<Report>>(API_ENDPOINTS.REPORTS, data)
  },

  update: (id: number, data: UpdateReportDto): Promise<ApiResponse<Report>> => {
    return apiService.patch<ApiResponse<Report>>(`${API_ENDPOINTS.REPORTS}/${id}`, data)
  },

  delete: (id: number): Promise<ApiResponse<Report>> => {
    return apiService.delete<ApiResponse<Report>>(`${API_ENDPOINTS.REPORTS}/${id}`)
  },
}

// User Org Maps API
export const userOrgMapsApi = {
  getAll: (): Promise<ApiResponse<UserOrgMap[]>> => {
    return apiService.get<ApiResponse<UserOrgMap[]>>(API_ENDPOINTS.USER_ORG_MAPS)
  },

  getById: (id: number): Promise<ApiResponse<UserOrgMap>> => {
    return apiService.get<ApiResponse<UserOrgMap>>(`${API_ENDPOINTS.USER_ORG_MAPS}/${id}`)
  },

  create: (data: CreateUserOrgMapDto): Promise<ApiResponse<UserOrgMap>> => {
    return apiService.post<ApiResponse<UserOrgMap>>(API_ENDPOINTS.USER_ORG_MAPS, data)
  },

  update: (id: number, data: UpdateUserOrgMapDto): Promise<ApiResponse<UserOrgMap>> => {
    return apiService.patch<ApiResponse<UserOrgMap>>(`${API_ENDPOINTS.USER_ORG_MAPS}/${id}`, data)
  },

  delete: (id: number): Promise<ApiResponse<UserOrgMap>> => {
    return apiService.delete<ApiResponse<UserOrgMap>>(`${API_ENDPOINTS.USER_ORG_MAPS}/${id}`)
  },
}

// Tableau API
export const tableauApi = {
  getWorkbooks: (connectionId: number): Promise<ApiResponse<Array<{ id: string; name: string }>>> => {
    return apiService.get<ApiResponse<Array<{ id: string; name: string }>>>(`${API_ENDPOINTS.TABLEAU}/${connectionId}/workbooks`)
  },

  getWorkbookViews: (connectionId: number, workbookId: string): Promise<ApiResponse<Array<{ id: string; name: string }>>> => {
    return apiService.get<ApiResponse<Array<{ id: string; name: string }>>>(`${API_ENDPOINTS.TABLEAU}/${connectionId}/workbook/${workbookId}/views`)
  },
}

// Health Check API
export const healthApi = {
  check: (): Promise<HealthCheck> => {
    return apiService.get<HealthCheck>(API_ENDPOINTS.HEALTH)
  },
}
