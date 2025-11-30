export interface Organization {
  id: string
  name: string
  displayName: string
  domain: string
  auth0Id?: string
  createdAt?: string
  updatedAt?: string
}

export interface UserCheckResponse {
  statusCode: number
  message: string
  result: {
    id: number
    email: string
    auth0Id: string
  }
}

export interface OrgCheckResponse {
  statusCode: number
  message: string
  result: {
    exists: boolean
    organization?: Organization
  }
}

export interface RegisterWithOrgRequest {
  email: string
  organizationId: string
}

export interface RegisterWithOrgResponse {
  success: boolean
  message: string
  userId?: string
}

export interface CreateOrgRequest {
  email: string
  organization: {
    name: string
    displayName: string
    domain: string
  }
}

export interface CreateOrgResponse {
  statusCode: number
  message: string
  result: {
    success: boolean
    message: string
    organization?: Organization
    userId?: number
  }
}

export interface OrgFormData {
  name: string
  displayName: string
  domain: string
  password?: string
}

export interface SignupFlowState {
  email?: string
  domain?: string
  organization?: Organization
}

export interface Auth0CreateUserResponse {
  data: {
    user_id: string
    email: string
    [key: string]: any
  }
}
