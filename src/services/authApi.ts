import { API_BASE_URL, API_ENDPOINTS } from '../config/constants'
import type {
  UserCheckResponse,
  OrgCheckResponse,
  RegisterWithOrgRequest,
  RegisterWithOrgResponse,
  CreateOrgRequest,
  CreateOrgResponse,
} from '../types/auth'

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

    // Get ID token from localStorage
    const idToken = localStorage.getItem('auth0_id_token')

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(idToken && { Authorization: `Bearer ${idToken}` }),
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

  async post<T>(endpoint: string, data: unknown, signal?: AbortSignal): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, signal)
  }
}

const apiService = new ApiService()

interface LoginRequest {
  email: string
}

interface LoginResponse {
  statusCode: number
  message: string
  result: {
    user: {
      userId: number
      userEmail: string
      auth0Id: string
    }
    accessToken: string
    expiresIn: string
  }
}

export const authApi = {
  login: (email: string, signal?: AbortSignal): Promise<LoginResponse> => {
    return apiService.post<LoginResponse>(
      API_ENDPOINTS.LOGIN,
      { email },
      signal
    )
  },

  checkEmail: (email: string, signal?: AbortSignal): Promise<UserCheckResponse> => {
    return apiService.post<UserCheckResponse>(
      API_ENDPOINTS.CHECK_EMAIL,
      { email },
      signal
    )
  },

  checkOrganization: (domain: string, signal?: AbortSignal): Promise<OrgCheckResponse> => {
    return apiService.post<OrgCheckResponse>(
      API_ENDPOINTS.CHECK_ORGANIZATION,
      { domain },
      signal
    )
  },

  registerWithOrg: (
    data: RegisterWithOrgRequest,
    signal?: AbortSignal
  ): Promise<RegisterWithOrgResponse> => {
    return apiService.post<RegisterWithOrgResponse>(
      API_ENDPOINTS.REGISTER_WITH_ORG,
      data,
      signal
    )
  },

  createOrganization: (
    data: CreateOrgRequest,
    signal?: AbortSignal
  ): Promise<CreateOrgResponse> => {
    return apiService.post<CreateOrgResponse>(
      API_ENDPOINTS.CREATE_ORGANIZATION,
      data,
      signal
    )
  },

  inviteUser: (orgId: string, email: string, inviterName: string, signal?: AbortSignal): Promise<any> => {
    console.log(orgId, email, inviterName)
    return apiService.post<any>(
      `/api/v1/auth0/organizations/${orgId}/invitations`,
      {
        email,
        inviter_name: inviterName
      },
      signal
    )
  },
}

export { ApiError }
