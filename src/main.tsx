import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.tsx'
import { Provider } from "./components/ui/provider.tsx"

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const audience = import.meta.env.VITE_AUTH0_AUDIENCE

if (!domain || !clientId) {
  throw new Error('Auth0 domain and clientId must be provided in environment variables')
}

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        // Don't include audience - use ID tokens for authentication
        scope: "openid profile email" // Removed offline_access as it requires refresh tokens
  }}
  useRefreshTokens={false} // Disable refresh tokens
  cacheLocation="localstorage"
    >
      <Provider>
        <App />
      </Provider>
    </Auth0Provider>
  // {/* </StrictMode>, */}
)
