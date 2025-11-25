// Common API Response wrapper
export interface ApiResponse<T> {
  statusCode: number
  message: string
  result: T
}

// User
export interface User {
  id: number
  email: string
  auth0Id: string
  createdAt?: string
  updatedAt?: string
  UserOrgMaps?: {
    role: string
    org: {
      id: number
      name: string
      domain: string
      auth0Id: string
    }
  }[]
}

export interface CreateUserDto {
  email: string
  auth0Id: string
}

export interface UpdateUserDto {
  email?: string
  auth0Id?: string
}

// Organization
export interface Org {
  id: number
  name: string
  domain: string
  auth0Id: string
  orgEncryptionKey: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateOrgDto {
  name: string
  domain: string
  auth0Id: string
  orgEncryptionKey: string
}

export interface UpdateOrgDto {
  name?: string
  domain?: string
  auth0Id?: string
  orgEncryptionKey?: string
}

// Billing
export interface Billing {
  id: number
  orgId: number
  planName: string
  planStartDate: string
  planExpiryDate: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateBillingDto {
  orgId: number
  planName: string
  planStartDate: string
  planExpiryDate: string
  isActive: boolean
}

export interface UpdateBillingDto {
  orgId?: number
  planName?: string
  planStartDate?: string
  planExpiryDate?: string
  isActive?: boolean
}

// Connection
export interface Connection {
  id: number
  orgId: number
  credentialId: number
  name: string
  server: string
  site: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateConnectionDto {
  orgId: number
  credentialId: number
  name: string
  server: string
  site: string
}

export interface UpdateConnectionDto {
  orgId?: number
  name?: string
  server?: string
  site?: string
  credentialId?: number
  isActive?: boolean
}

export interface CreateConnectionWithCredentialsDto {
  orgId: number
  name: string
  server: string
  site: string
  connectionType: 'USERNAME' | 'PAT'
  tokenName: string
  tokenSecret: string
  username: string
  password: string
}

// Credential
export interface Credential {
  id: number
  orgId: number
  credentialName: string
  credentialType: string
  tokenName: string
  encryptedTokenValue: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateCredentialDto {
  orgId: number
  connectionType: 'USERNAME' | 'PAT'
  tokenName: string
  tokenSecret: string
  username: string
  password: string
}

export interface UpdateCredentialDto {
  orgId?: number
  credentialName?: string
  credentialType?: string
  tokenName?: string
  encryptedTokenValue?: string
}

// Report
export interface Report {
  id: number
  connectionId: number
  workbookName: string
  viewName: string
  workbookId: string
  viewId: string
  fileFormat: string
  orientation: string
  apiKey: string
  parameters: any
  createdAt?: string
  updatedAt?: string
}

export interface CreateReportDto {
  connectionId: number
  workbookName: string
  viewName: string
  workbookId: string
  viewId: string
  fileFormat: string
  orientation: string
  apiKey: string
  apiSecret: string
  parameters: any
}

export interface UpdateReportDto {
  connectionId?: number
  workbookName?: string
  viewName?: string
  workbookId?: string
  viewId?: string
  fileFormat?: string
  orientation?: string
  apiKey?: string
  apiSecret?: string
  parameters?: any
}

// UserOrgMap
export interface UserOrgMap {
  id: number
  userId: number
  orgId: number
  role: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserOrgMapDto {
  userId: number
  orgId: number
  role: string
}

export interface UpdateUserOrgMapDto {
  userId?: number
  orgId?: number
  role?: string
}

// Health Check
export interface HealthCheck {
  status: string
  info?: Record<string, any>
  error?: Record<string, any>
  details?: Record<string, any>
}
