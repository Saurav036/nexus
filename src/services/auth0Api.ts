import { API_BASE_URL, API_ENDPOINTS } from '../config/constants'

class ApiError extends Error {
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
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    signal?: AbortSignal
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new ApiError(
          response.status,
          data,
          data.message || 'Request failed'
        )
      }

      return data as T
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request was cancelled')
        }
        throw new Error(`Network error: ${error.message}`)
      }

      throw new Error('An unknown error occurred')
    }
  }

  async get<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' }, signal)
  }

  async post<T>(endpoint: string, data: unknown, signal?: AbortSignal): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, signal)
  }
}

const apiService = new ApiService()

interface Auth0User {
  user_id: string
  email: string
  name?: string
  created_at?: string
  updated_at?: string
}

interface Auth0Organization {
  id: string
  name: string
  display_name?: string
}

interface Auth0CreateUserRequest {
  email: string
  password?: string
  name?: string
  email_verified?: boolean
  verify_email?: boolean
  connection?: string
  blocked?: boolean
  app_metadata?: Record<string, any>
  user_metadata?: Record<string, any>
}

interface Auth0CreateUserResponse {
  statusCode: number
  message: string
  result: {
    user_id: string
    email: string
    name?: string
  }
}

interface Auth0GetUsersResponse {
  statusCode: number
  message: string
  result: Auth0User[]
}

interface Auth0GetUserResponse {
  statusCode: number
  message: string
  result: Auth0User
}

interface Auth0GetOrganizationsResponse {
  statusCode: number
  message: string
  result: Auth0Organization[]
}

interface Auth0GetOrganizationResponse {
  statusCode: number
  message: string
  result: Auth0Organization
}

interface Auth0AssignUserToOrgRequest {
  members: string[] // Array of Auth0 user IDs
}

interface Auth0AssignUserToOrgResponse {
  statusCode: number
  message: string
}

interface Auth0CreateOrgRequest {
  name: string
  display_name?: string
}

interface Auth0CreateOrgResponse {
  statusCode: number
  message: string
  result: {
    id: string
    name: string
    display_name?: string
  }
}

interface Auth0RegisterRequest {
  orgName: string
  display_name?: string
  orgDomain: string
  userEmail: string
  userPassword: string
}

interface Auth0RegisterResponse {
  statusCode: number
  message: string
}

export const auth0Api = {
  // Users endpoints
  getUsers: (signal?: AbortSignal): Promise<Auth0GetUsersResponse> => {
    return apiService.get<Auth0GetUsersResponse>(
      API_ENDPOINTS.AUTH0_USERS,
      signal
    )
  },

  getUserById: (id: string, signal?: AbortSignal): Promise<Auth0GetUserResponse> => {
    return apiService.get<Auth0GetUserResponse>(
      `${API_ENDPOINTS.AUTH0_USERS}/${id}`,
      signal
    )
  },

  getUserByEmail: (email: string, signal?: AbortSignal): Promise<Auth0GetUserResponse> => {
    return apiService.get<Auth0GetUserResponse>(
      `${API_ENDPOINTS.AUTH0_USERS}/email/${email}`,
      signal
    )
  },

  createUser: (
    data: Auth0CreateUserRequest,
    signal?: AbortSignal
  ): Promise<Auth0CreateUserResponse> => {
    return apiService.post<Auth0CreateUserResponse>(
      API_ENDPOINTS.AUTH0_USERS,
      data,
      signal
    )
  },

  // Organizations endpoints
  getOrganizations: (signal?: AbortSignal): Promise<Auth0GetOrganizationsResponse> => {
    return apiService.get<Auth0GetOrganizationsResponse>(
      API_ENDPOINTS.AUTH0_ORGANIZATIONS,
      signal
    )
  },

  getOrganizationById: (id: string, signal?: AbortSignal): Promise<Auth0GetOrganizationResponse> => {
    return apiService.get<Auth0GetOrganizationResponse>(
      `${API_ENDPOINTS.AUTH0_ORGANIZATIONS}/${id}`,
      signal
    )
  },

  getOrganizationByName: (name: string, signal?: AbortSignal): Promise<Auth0GetOrganizationResponse> => {
    return apiService.get<Auth0GetOrganizationResponse>(
      `${API_ENDPOINTS.AUTH0_ORGANIZATIONS}/name/${name}`,
      signal
    )
  },

  createOrg: (
    data: Auth0CreateOrgRequest,
    signal?: AbortSignal
  ): Promise<Auth0CreateOrgResponse> => {
    return apiService.post<Auth0CreateOrgResponse>(
      API_ENDPOINTS.AUTH0_ORGANIZATIONS,
      data,
      signal
    )
  },

  assignUserToOrg: (
    orgId: string,
    data: Auth0AssignUserToOrgRequest,
    signal?: AbortSignal
  ): Promise<Auth0AssignUserToOrgResponse> => {
    return apiService.post<Auth0AssignUserToOrgResponse>(
      `${API_ENDPOINTS.AUTH0_ORGANIZATIONS}/${orgId}/members`,
      data,
      signal
    )
  },

  // Register endpoint - creates org, user, and mapping in one go
  register: (
    data: Auth0RegisterRequest,
    signal?: AbortSignal
  ): Promise<Auth0RegisterResponse> => {
    return apiService.post<Auth0RegisterResponse>(
      API_ENDPOINTS.AUTH0_REGISTER,
      data,
      signal
    )
  },
}

export { ApiError }
