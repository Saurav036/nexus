export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

// Enforce HTTPS in production
if (import.meta.env.PROD && !API_BASE_URL.startsWith('https://')) {
  console.warn('Warning: API should use HTTPS in production')
}

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SIGNUP_USER_EXISTS: '/signup/user-exists',
  SIGNUP_PUBLIC_DOMAIN: '/signup/public-domain',
  SIGNUP_ORG_EXISTS: '/signup/org-exists',
  SIGNUP_CREATE_ORG: '/signup/create-org',
} as const

export const API_ENDPOINTS = {
  // Auth endpoints
  CHECK_EMAIL: '/api/v1/auth/check-email',
  CHECK_ORGANIZATION: '/api/v1/auth0/check-organization',
  REGISTER_WITH_ORG: '/api/v1/auth/register-with-org',
  // CREATE_ORGANIZATION: '/api/v1/auth/create-organization',
  CREATE_ORGANIZATION: '/api/v1/auth0/organizations',
  LOGIN: '/api/v1/auth/login',

  // Auth0 endpoints
  AUTH0_USERS: '/api/v1/auth0/users',
  AUTH0_ORGANIZATIONS: '/api/v1/auth0/organizations',
  AUTH0_REGISTER: '/api/v1/auth0/register',

  // Users endpoints
  USERS: '/api/v1/users',

  // Organizations endpoints (database)
  ORGS: '/api/v1/orgs',

  // Billings endpoints
  BILLINGS: '/api/v1/billings',

  // Connections endpoints
  CONNECTIONS: '/api/v1/connections',

  // Credentials endpoints
  CREDENTIALS: '/api/v1/credentials',

  // Reports endpoints
  REPORTS: '/api/v1/reports',

  // User Org Maps endpoints
  USER_ORG_MAPS: '/api/v1/user-org-maps',

  // Tableau endpoints
  TABLEAU: '/api/v1/tableau',

  // Health check
  HEALTH: '/api/v1/health',
} as const

export const PUBLIC_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'aol.com',
  'protonmail.com',
  'mail.com',
  'zoho.com',
  'yandex.com',
  'live.com',
  'msn.com',
] as const

export const UI_CONFIG = {
  SUPPORT_EMAIL: 'support@nexus.com',
  APP_NAME: 'Nexus for Tableau',
  GRADIENT: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  REQUEST_TIMEOUT: 10000, // 10 seconds
} as const
