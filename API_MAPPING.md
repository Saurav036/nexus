# API Endpoints Mapping Documentation

This document provides a comprehensive mapping of all API endpoints from the backend to the UI service layer.

## Overview

All API endpoints from `packages/api/README.md` have been mapped to corresponding UI service methods in the `packages/ui/src/services/` directory.

---

## Authentication Endpoints

**Location:** `packages/ui/src/services/authApi.ts`

| Backend Endpoint | UI Service Method | HTTP Method | Description |
|------------------|-------------------|-------------|-------------|
| `/auth/check-email` | `authApi.checkEmail(email)` | POST | Checks if an email exists |
| `/auth/login` | `authApi.login(email)` | POST | Generates an access token for a user |
| `/auth/check-organization` | `authApi.checkOrganization(domain)` | POST | Checks if an organization exists |
| `/auth/register-with-org` | `authApi.registerWithOrg(data)` | POST | Register user with existing organization |
| `/auth/create-organization` | `authApi.createOrganization(data)` | POST | Create new organization |

### Usage Example:
```typescript
import { authApi } from '../services/authApi'

// Login
const response = await authApi.login('user@example.com')
// Response: { statusCode, message, result: { user, accessToken, expiresIn } }

// Check email
const emailCheck = await authApi.checkEmail('user@example.com')
```

---

## Auth0 Management Endpoints

**Location:** `packages/ui/src/services/auth0Api.ts`

### Users

| Backend Endpoint | UI Service Method | HTTP Method | Description |
|------------------|-------------------|-------------|-------------|
| `/auth0/users` | `auth0Api.getUsers()` | GET | List all users for the Auth0 tenant |
| `/auth0/users/:id` | `auth0Api.getUserById(id)` | GET | Get user by ID |
| `/auth0/users/email/:email` | `auth0Api.getUserByEmail(email)` | GET | Get user by email |
| `/auth0/users` | `auth0Api.createUser(data)` | POST | Create a new user |

### Organizations

| Backend Endpoint | UI Service Method | HTTP Method | Description |
|------------------|-------------------|-------------|-------------|
| `/auth0/organizations` | `auth0Api.getOrganizations()` | GET | List all organizations for the Auth0 tenant |
| `/auth0/organizations/:id` | `auth0Api.getOrganizationById(id)` | GET | Get organization by ID |
| `/auth0/organizations/name/:name` | `auth0Api.getOrganizationByName(name)` | GET | Get organization by name |
| `/auth0/organizations` | `auth0Api.createOrg(data)` | POST | Create a new organization |
| `/auth0/organizations/:orgId/members` | `auth0Api.assignUserToOrg(orgId, data)` | POST | Assign users to organization |

### Usage Example:
```typescript
import { auth0Api } from '../services/auth0Api'

// Get all Auth0 users
const users = await auth0Api.getUsers()

// Get organization by name
const org = await auth0Api.getOrganizationByName('acme-corp')

// Assign user to org
await auth0Api.assignUserToOrg('org_123', { members: ['auth0|user123'] })
```

---

## Health Check Endpoint

**Location:** `packages/ui/src/services/api.ts`

| Backend Endpoint | UI Service Method | HTTP Method | Description |
|------------------|-------------------|-------------|-------------|
| `/health` | `healthApi.check()` | GET | Provides a health check for the application and database |

### Usage Example:
```typescript
import { healthApi } from '../services/api'

const health = await healthApi.check()
// Response: { status, info, error, details }
```

---

## Users CRUD Endpoints

**Location:** `packages/ui/src/services/api.ts` - `usersApi` object

| Backend Endpoint | UI Service Method | HTTP Method | Description |
|------------------|-------------------|-------------|-------------|
| `/users` | `usersApi.getAll()` | GET | Retrieves a list of all users |
| `/users/:id` | `usersApi.getById(id)` | GET | Retrieves a single user by their ID |
| `/users/email/:email` | `usersApi.getByEmail(email)` | GET | Retrieves a single user by their email |
| `/users/auth0/:auth0Id` | `usersApi.getByAuth0Id(auth0Id)` | GET | Retrieves a single user by their Auth0 ID |
| `/users` | `usersApi.create(data)` | POST | Creates a new user |
| `/users/:id` | `usersApi.update(id, data)` | PATCH | Updates an existing user's information |
| `/users/:id` | `usersApi.delete(id)` | DELETE | Deletes a user by their ID |

### Usage Example:
```typescript
import { usersApi, ApiError } from '../services/api'
import type { CreateUserDto, UpdateUserDto } from '../types/api'

// Get all users
const response = await usersApi.getAll()
const users = response.result

// Get user by email
const user = await usersApi.getByEmail('user@example.com')

// Create user
const newUser: CreateUserDto = {
  email: 'user@example.com',
  auth0Id: 'auth0|123'
}
await usersApi.create(newUser)

// Update user
const updates: UpdateUserDto = { email: 'newemail@example.com' }
await usersApi.update(1, updates)

// Delete user
await usersApi.delete(1)
```

---

## Organizations CRUD Endpoints

**Location:** `packages/ui/src/services/api.ts` - `orgsApi` object

| Backend Endpoint | UI Service Method | HTTP Method | Description |
|------------------|-------------------|-------------|-------------|
| `/orgs` | `orgsApi.getAll()` | GET | Retrieves a list of all organizations |
| `/orgs/:id` | `orgsApi.getById(id)` | GET | Retrieves a single organization by its ID |
| `/orgs/domain/:domain` | `orgsApi.getByDomain(domain)` | GET | Retrieves a single organization by its domain |
| `/orgs/auth0/:auth0Id` | `orgsApi.getByAuth0Id(auth0Id)` | GET | Retrieves a single organization by its Auth0 ID |
| `/orgs` | `orgsApi.create(data)` | POST | Creates a new organization |
| `/orgs/:id` | `orgsApi.update(id, data)` | PATCH | Updates an existing organization's information |
| `/orgs/:id` | `orgsApi.delete(id)` | DELETE | Deletes an organization by its ID |

### Usage Example:
```typescript
import { orgsApi } from '../services/api'
import type { CreateOrgDto, UpdateOrgDto } from '../types/api'

// Get all organizations
const response = await orgsApi.getAll()
const orgs = response.result

// Get org by domain
const org = await orgsApi.getByDomain('acme.com')

// Get org by Auth0 ID
const orgByAuth0 = await orgsApi.getByAuth0Id('org_123')

// Create organization
const newOrg: CreateOrgDto = {
  name: 'Acme Corp',
  domain: 'acme.com',
  auth0Id: 'org_123',
  orgEncryptionKey: 'encrypted_key'
}
await orgsApi.create(newOrg)

// Update organization
const updates: UpdateOrgDto = { name: 'Acme Corporation' }
await orgsApi.update(1, updates)

// Delete organization
await orgsApi.delete(1)
```

---

## Billings CRUD Endpoints

**Location:** `packages/ui/src/services/api.ts` - `billingsApi` object

| Backend Endpoint | UI Service Method | HTTP Method | Description |
|------------------|-------------------|-------------|-------------|
| `/billings` | `billingsApi.getAll()` | GET | Retrieves a list of all billing records |
| `/billings/:id` | `billingsApi.getById(id)` | GET | Retrieves a single billing record by its ID |
| `/billings` | `billingsApi.create(data)` | POST | Creates a new billing record |
| `/billings/:id` | `billingsApi.update(id, data)` | PATCH | Updates an existing billing record |
| `/billings/:id` | `billingsApi.delete(id)` | DELETE | Deletes a billing record by its ID |

### Usage Example:
```typescript
import { billingsApi } from '../services/api'
import type { CreateBillingDto } from '../types/api'

// Get all billings
const response = await billingsApi.getAll()
const billings = response.result

// Create billing
const newBilling: CreateBillingDto = {
  orgId: 1,
  planName: 'Enterprise',
  planStartDate: '2025-01-01',
  planExpiryDate: '2026-01-01',
  isActive: true
}
await billingsApi.create(newBilling)
```

---

## Connections CRUD Endpoints

**Location:** `packages/ui/src/services/api.ts` - `connectionsApi` object

| Backend Endpoint | UI Service Method | HTTP Method | Description |
|------------------|-------------------|-------------|-------------|
| `/connections` | `connectionsApi.getAll()` | GET | Retrieves a list of all connections |
| `/connections/:id` | `connectionsApi.getById(id)` | GET | Retrieves a single connection by its ID |
| `/connections` | `connectionsApi.create(data)` | POST | Creates a new connection |
| `/connections/:id` | `connectionsApi.update(id, data)` | PATCH | Updates an existing connection |
| `/connections/:id` | `connectionsApi.delete(id)` | DELETE | Deletes a connection by its ID |

### Usage Example:
```typescript
import { connectionsApi } from '../services/api'
import type { CreateConnectionDto } from '../types/api'

// Get all connections
const response = await connectionsApi.getAll()
const connections = response.result

// Create connection
const newConnection: CreateConnectionDto = {
  orgId: 1,
  connectionName: 'Production Tableau',
  serverUrl: 'https://tableau.acme.com',
  siteId: 'site123',
  credentialId: 1
}
await connectionsApi.create(newConnection)
```

---

## Credentials CRUD Endpoints

**Location:** `packages/ui/src/services/api.ts` - `credentialsApi` object

| Backend Endpoint | UI Service Method | HTTP Method | Description |
|------------------|-------------------|-------------|-------------|
| `/credentials` | `credentialsApi.getAll()` | GET | Retrieves a list of all credentials |
| `/credentials/:id` | `credentialsApi.getById(id)` | GET | Retrieves a single credential by its ID |
| `/credentials` | `credentialsApi.create(data)` | POST | Creates a new credential |
| `/credentials/:id` | `credentialsApi.update(id, data)` | PATCH | Updates an existing credential |
| `/credentials/:id` | `credentialsApi.delete(id)` | DELETE | Deletes a credential by its ID |

### Usage Example:
```typescript
import { credentialsApi } from '../services/api'
import type { CreateCredentialDto } from '../types/api'

// Get all credentials
const response = await credentialsApi.getAll()
const credentials = response.result

// Create credential
const newCredential: CreateCredentialDto = {
  orgId: 1,
  credentialName: 'Tableau PAT',
  credentialType: 'Personal Access Token',
  tokenName: 'my_token',
  encryptedTokenValue: 'encrypted_value'
}
await credentialsApi.create(newCredential)
```

---

## Reports CRUD Endpoints

**Location:** `packages/ui/src/services/api.ts` - `reportsApi` object

| Backend Endpoint | UI Service Method | HTTP Method | Description |
|------------------|-------------------|-------------|-------------|
| `/reports` | `reportsApi.getAll()` | GET | Retrieves a list of all reports |
| `/reports/:id` | `reportsApi.getById(id)` | GET | Retrieves a single report by its ID |
| `/reports` | `reportsApi.create(data)` | POST | Creates a new report |
| `/reports/:id` | `reportsApi.update(id, data)` | PATCH | Updates an existing report |
| `/reports/:id` | `reportsApi.delete(id)` | DELETE | Deletes a report by its ID |

### Usage Example:
```typescript
import { reportsApi } from '../services/api'
import type { CreateReportDto } from '../types/api'

// Get all reports
const response = await reportsApi.getAll()
const reports = response.result

// Create report
const newReport: CreateReportDto = {
  orgId: 1,
  connectionId: 1,
  reportName: 'Monthly Sales Report',
  workbookName: 'Sales Dashboard',
  viewName: 'Monthly View',
  fileFormat: 'PDF',
  recipientEmails: 'team@acme.com',
  scheduleTime: '09:00',
  scheduleFrequency: 'daily',
  apiKey: 'api_key_123'
}
await reportsApi.create(newReport)
```

---

## User Org Maps CRUD Endpoints

**Location:** `packages/ui/src/services/api.ts` - `userOrgMapsApi` object

| Backend Endpoint | UI Service Method | HTTP Method | Description |
|------------------|-------------------|-------------|-------------|
| `/user-org-maps` | `userOrgMapsApi.getAll()` | GET | Retrieves a list of all user-organization mappings |
| `/user-org-maps/:id` | `userOrgMapsApi.getById(id)` | GET | Retrieves a single user-organization mapping by its ID |
| `/user-org-maps` | `userOrgMapsApi.create(data)` | POST | Creates a new user-organization mapping |
| `/user-org-maps/:id` | `userOrgMapsApi.update(id, data)` | PATCH | Updates an existing user-organization mapping |
| `/user-org-maps/:id` | `userOrgMapsApi.delete(id)` | DELETE | Deletes a user-organization mapping by its ID |

### Usage Example:
```typescript
import { userOrgMapsApi } from '../services/api'
import type { CreateUserOrgMapDto } from '../types/api'

// Get all user-org mappings
const response = await userOrgMapsApi.getAll()
const mappings = response.result

// Create user-org mapping
const newMapping: CreateUserOrgMapDto = {
  userId: 1,
  orgId: 1,
  role: 'admin'
}
await userOrgMapsApi.create(newMapping)
```

---

## Error Handling

All service methods can throw `ApiError` which contains:
- `status`: HTTP status code
- `data`: Response data from the API
- `message`: Error message

### Example:
```typescript
import { usersApi, ApiError } from '../services/api'

try {
  const users = await usersApi.getAll()
} catch (error) {
  if (error instanceof ApiError) {
    console.error('Status:', error.status)
    console.error('Data:', error.data)
    console.error('Message:', error.message)
  } else {
    console.error('Unexpected error:', error)
  }
}
```

---

## API Response Structure

All endpoints follow a consistent response structure:

```typescript
interface ApiResponse<T> {
  statusCode: number
  message: string
  result: T
}
```

### Example:
```typescript
const response = await usersApi.getAll()
// response.statusCode => 200
// response.message => "Users retrieved successfully"
// response.result => User[]
```

---

## Request Cancellation

All service methods support AbortSignal for request cancellation:

```typescript
const controller = new AbortController()

// Start request
const promise = usersApi.getAll(controller.signal)

// Cancel request
controller.abort()

try {
  await promise
} catch (error) {
  // Will throw "Request was cancelled"
}
```

---

## Configuration

API base URL is configured in `packages/ui/src/config/constants.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
```

Set the environment variable in `.env`:
```
VITE_API_BASE_URL=http://localhost:3000
```

---

## Summary

All 48 API endpoints from the backend have been successfully mapped to the UI service layer:

- **Authentication**: 5 endpoints (authApi.ts)
- **Auth0 Users**: 4 endpoints (auth0Api.ts)
- **Auth0 Organizations**: 5 endpoints (auth0Api.ts)
- **Users**: 7 endpoints (api.ts)
- **Organizations**: 7 endpoints (api.ts)
- **Billings**: 5 endpoints (api.ts)
- **Connections**: 5 endpoints (api.ts)
- **Credentials**: 5 endpoints (api.ts)
- **Reports**: 5 endpoints (api.ts)
- **User Org Maps**: 5 endpoints (api.ts)
- **Health Check**: 1 endpoint (api.ts)

All TypeScript types and DTOs are defined in:
- `packages/ui/src/types/api.ts` - Main resource types
- `packages/ui/src/types/auth.ts` - Authentication types
- `packages/ui/src/services/auth0Api.ts` - Auth0-specific types (internal)

The UI is now fully equipped to interact with all backend API endpoints!
