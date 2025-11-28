import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '../config/constants'
import type { SignupFlowState } from '../types/auth'

export const useSignupFlow = (requiredFields: (keyof SignupFlowState)[] = []) => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as SignupFlowState) || {}

  // Validate that required state fields are present
  useEffect(() => {
    if (requiredFields.length > 0) {
      const missingFields = requiredFields.filter(field => !state[field])
      if (missingFields.length > 0) {
        // Redirect to start if required state is missing
        navigate(ROUTES.SIGNUP, { replace: true })
      }
    }
  }, [navigate, requiredFields, state])

  const goToUserExists = (email: string) => {
    navigate(ROUTES.SIGNUP_USER_EXISTS, { state: { email } })
  }

  const goToPublicDomain = (email: string, domain: string) => {
    navigate(ROUTES.SIGNUP_PUBLIC_DOMAIN, { state: { email, domain } })
  }

  const goToOrgExists = (email: string, organization: SignupFlowState['organization']) => {
    navigate(ROUTES.SIGNUP_ORG_EXISTS, { state: { email, organization } })
  }

  const goToCreateOrg = (email: string, domain: string) => {
    navigate(ROUTES.SIGNUP_CREATE_ORG, { state: { email, domain } })
  }

  const goToLogin = () => {
    navigate(ROUTES.LOGIN)
  }

  const goToHome = () => {
    navigate(ROUTES.HOME)
  }

  const goToSignup = () => {
    navigate(ROUTES.SIGNUP, { replace: true })
  }

  return {
    state,
    goToUserExists,
    goToPublicDomain,
    goToOrgExists,
    goToCreateOrg,
    goToLogin,
    goToHome,
    goToSignup,
  }
}
