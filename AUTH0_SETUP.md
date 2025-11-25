# Auth0 Setup Guide

This project uses Auth0 for authentication. Follow these steps to configure Auth0.

## Prerequisites

- Node.js 20 LTS or higher
- An Auth0 account (free tier works fine)

## Step 1: Create Auth0 Application

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** → **Applications**
3. Click **Create Application**
4. Choose a name for your application (e.g., "Odyssey Tableau Mailer")
5. Select **Single Page Web Applications**
6. Click **Create**

## Step 2: Configure Application Settings

In your Auth0 application settings, configure the following URLs:

### Development (localhost)

- **Allowed Callback URLs**: `http://localhost:5173/callback`
- **Allowed Logout URLs**: `http://localhost:5173`
- **Allowed Web Origins**: `http://localhost:5173`

### Production

Update these URLs to match your production domain:

- **Allowed Callback URLs**: `https://yourdomain.com/callback`
- **Allowed Logout URLs**: `https://yourdomain.com`
- **Allowed Web Origins**: `https://yourdomain.com`

### Enable Refresh Tokens

To persist authentication across page refreshes, you must enable Refresh Token Rotation:

1. In your Auth0 Application settings, scroll down to **Advanced Settings**
2. Click on the **Grant Types** tab
3. Ensure **Refresh Token** is checked
4. Click **Save Changes**

This is required for the `useRefreshTokens={true}` configuration in the app to work properly.

## Step 3: Create Auth0 API (Optional - For API Access)

**Note:** This step is optional. You can skip it for basic authentication.

If you need to call protected APIs with access tokens:

1. Navigate to **Applications** → **APIs** in Auth0 Dashboard
2. Click **Create API**
3. Provide:
   - **Name**: Odyssey Tableau Mailer API
   - **Identifier**: `https://api.odyssey-tableau-mailer.com` (or your custom API identifier)
   - **Signing Algorithm**: RS256
4. Click **Create**
5. Use this identifier as your `VITE_AUTH0_AUDIENCE` in `.env`

**Important:** Do NOT use `https://your-domain.auth0.com/api/v2/` as the audience. This is the Auth0 Management API and requires special permissions.

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env` in the `packages/ui` directory:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Auth0 credentials in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000

   # Auth0 Configuration
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   # Leave audience empty for basic authentication
   VITE_AUTH0_AUDIENCE=
   ```

### Finding Your Credentials

- **Domain**: Found in Application Settings → Basic Information → Domain
- **Client ID**: Found in Application Settings → Basic Information → Client ID
- **Audience**: (Optional) The API Identifier you created in Step 3. Leave empty for basic auth.

## Step 5: Configure Auth0 Organizations (Optional)

If you're using Auth0 Organizations feature:

1. Navigate to **User Management** → **Organizations**
2. Create organizations as needed
3. Configure organization settings in your application

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   cd packages/ui
   npm run dev
   ```

2. Navigate to `http://localhost:5173/login`
3. Click "Sign In with Auth0"
4. You should be redirected to Auth0's login page

## Features Implemented

✅ Auth0Provider integration
✅ Login with redirect
✅ Logout functionality
✅ Protected routes
✅ Access token retrieval
✅ User profile access
✅ Loading states
✅ Persistent authentication (localStorage cache)
✅ Refresh token support
✅ Email verification guard
✅ Bearer token injection in API calls

## Usage in Components

### Login
```tsx
import { useAuth } from '../contexts/AuthContext'

const MyComponent = () => {
  const { login } = useAuth()

  return <button onClick={login}>Login</button>
}
```

### Logout
```tsx
import { useAuth } from '../contexts/AuthContext'

const MyComponent = () => {
  const { logout } = useAuth()

  return <button onClick={logout}>Logout</button>
}
```

### Get User Info
```tsx
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return null

  return (
    <div>
      <p>Email: {user?.userEmail}</p>
      <p>Name: {user?.name}</p>
    </div>
  )
}
```

### Get Access Token
```tsx
import { useAuth } from '../contexts/AuthContext'

const MyComponent = () => {
  const { getAccessToken } = useAuth()

  const callAPI = async () => {
    const token = await getAccessToken()
    // Use token in API calls
  }
}
```

## Security Notes

⚠️ **IMPORTANT SECURITY WARNINGS:**

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Never hardcode credentials** - Always use environment variables
3. **Use HTTPS in production** - Auth0 requires HTTPS for production
4. **Rotate secrets regularly** - Update Client Secret periodically
5. **Enable MFA** - Strongly recommended for production

## Troubleshooting

### "Callback URL mismatch" error
- Verify your callback URLs in Auth0 Dashboard match your app's URL exactly: `http://localhost:5173/callback`
- Make sure to save changes in Auth0 Dashboard after adding the callback URL
- The callback URL must include `/callback` at the end

### "Invalid state" error
- Clear your browser cache and cookies
- Check that your domain and clientId are correct

### Token not being retrieved
- Verify API Audience is configured correctly
- Check that API permissions are set up in Auth0 Dashboard

### "Unauthorized" error after login
- Make sure you're NOT using the Auth0 Management API audience (`https://your-domain.auth0.com/api/v2/`)
- Leave `VITE_AUTH0_AUDIENCE` empty for basic authentication
- If using a custom API, ensure it's properly configured in Auth0 Dashboard

### Authentication lost on page refresh
- Verify that Refresh Token grant type is enabled in your Auth0 Application settings (see Step 2)
- Check that `cacheLocation="localstorage"` and `useRefreshTokens={true}` are set in Auth0Provider (packages/ui/src/main.tsx)
- Clear localStorage and try logging in again: `localStorage.clear()`

### Email verification required
- Users with unverified emails will be redirected to `/verify-email` page
- They must verify their email through the Auth0 verification email
- After verification, they can click "Check Again" to proceed

## Additional Resources

- [Auth0 React SDK Documentation](https://auth0.com/docs/libraries/auth0-react)
- [Auth0 SPA Quickstart](https://auth0.com/docs/quickstart/spa/react)
- [Auth0 Organizations](https://auth0.com/docs/manage-users/organizations)
