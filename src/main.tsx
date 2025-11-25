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
  <StrictMode>
    <Auth0Provider
      domain={'sproutlogix-dev.us.auth0.com'}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/callback`,
        // Only include audience if it's provided and not the Management API
        // ...(audience && !audience.includes('/api/v2/') ? { audience } : {}),
        audience: audience,
         scope: "openid profile email offline_access" // Make sure offline_access is included
  }}
  useRefreshTokens={true} // Enable refresh tokens
  cacheLocation="localstorage" 
    >
      <Provider>
        <App />
      </Provider>
    </Auth0Provider>
  </StrictMode>,
)
