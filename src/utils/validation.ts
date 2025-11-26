const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ORG_NAME_REGEX = /^[a-z0-9-]+$/
const DOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i

export const validators = {
  email: (email: string): string | null => {
    if (!email) return 'Email is required'
    if (!EMAIL_REGEX.test(email)) {
      return 'Please enter a valid email address'
    }
    if (email.length > 254) {
      return 'Email address is too long'
    }
    return null
  },

  orgName: (name: string): string | null => {
    if (!name) return 'Organization name is required'
    if (name.length < 3) {
      return 'Organization name must be at least 3 characters'
    }
    if (name.length > 50) {
      return 'Organization name must be less than 50 characters'
    }
    if (!ORG_NAME_REGEX.test(name)) {
      return 'Organization name must contain only lowercase letters, numbers, and hyphens'
    }
    if (name.startsWith('-') || name.endsWith('-')) {
      return 'Organization name cannot start or end with a hyphen'
    }
    return null
  },

  displayName: (displayName: string): string | null => {
    if (!displayName) return 'Display name is required'
    if (displayName.length < 2) {
      return 'Display name must be at least 2 characters'
    }
    if (displayName.length > 100) {
      return 'Display name must be less than 100 characters'
    }
    return null
  },

  domain: (domain: string): string | null => {
    if (!domain) return 'Domain is required'
    if (!DOMAIN_REGEX.test(domain)) {
      return 'Please enter a valid domain (e.g., company.com)'
    }
    if (domain.length > 253) {
      return 'Domain is too long'
    }
    if (domain.includes('http://') || domain.includes('https://')) {
      return 'Domain should not include http:// or https://'
    }
    if (domain.includes('/')) {
      return 'Domain should not include paths'
    }
    return null
  },

  password: (password: string): string | null => {
    if (!password) return 'Password is required'
    if (password.length < 8) {
      return 'Password must be at least 8 characters'
    }
    if (password.length > 128) {
      return 'Password must be less than 128 characters'
    }
    // Check for at least one uppercase, one lowercase, one number, and one special character
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return 'Password must contain uppercase, lowercase, number, and special character'
    }
    return null
  },
}

export const sanitizeInput = (input: string): string => {
  return input.trim()
}

export const extractDomain = (email: string): string | null => {
  const parts = email.split('@')
  if (parts.length !== 2) return null
  return parts[1].toLowerCase()
}

export const isPublicDomain = (domain: string, publicDomains: readonly string[]): boolean => {
  return publicDomains.includes(domain.toLowerCase())
}
