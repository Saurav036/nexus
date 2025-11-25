# Odyssey Tableau Mailer - UI

React-based frontend application for the Odyssey Tableau Mailer API management dashboard.

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Chakra UI v3** - Component library (minimal usage)
- **React Icons** - Icon library

## Project Structure

```
src/
├── pages/
│   ├── Home.tsx                    # Dashboard home page
│   ├── Auth/
│   │   └── CheckEmail.tsx          # Email verification page
│   ├── Auth0/
│   │   └── Organizations.tsx       # Auth0 organization management
│   ├── Users/
│   │   ├── UserList.tsx           # User list with table
│   │   ├── UserCreate.tsx         # User creation form
│   │   ├── UserDetail.tsx         # User detail view
│   │   └── UserEdit.tsx           # User edit form
│   └── Health.tsx                  # System health status
├── App.tsx                         # Main app with routes
├── main.tsx                        # App entry point
└── index.css                       # Tailwind CSS imports
```

## Routes

The application includes the following routes corresponding to backend API endpoints:

### Dashboard
- `/` - Home page with navigation cards

### Users Management
- `/users` - List all users (GET /api/users)
- `/users/create` - Create new user (POST /api/users)
- `/users/:id` - View user details (GET /api/users/:id)
- `/users/:id/edit` - Edit user (PATCH /api/users/:id)

### Authentication
- `/auth/check-email` - Check if email exists (POST /api/auth/check-email)

### Auth0
- `/auth0/organizations` - List and create Auth0 organizations (GET/POST /api/auth0/organizations)

### Health
- `/health` - System health check (GET /api/health)

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Features

### User Management
- View all users in a table
- Create new users with email, first name, and last name
- View detailed user information
- Edit existing users
- Delete users with confirmation

### Email Verification
- Check if a user exists by email
- Visual feedback for found/not found status

### Auth0 Organizations
- List all Auth0 organizations
- Create new organizations with name and display name
- Modal-based creation form

### Health Monitoring
- Real-time system health status
- API and database status indicators
- Auto-refresh every 30 seconds
- Color-coded status badges (green/red/yellow)

## API Integration

All pages include TODO comments for API integration. Currently, the pages have:
- Empty state handling
- Loading states with spinners
- Error handling with alerts
- Form validation
- Proper TypeScript typing

To connect to the backend API:
1. Update the fetch URLs in each component
2. Add proper authentication headers (JWT tokens)
3. Handle the API response format
4. Update state with real data

Example:
```typescript
// Replace this:
// TODO: Replace with actual API call
// const response = await fetch('/api/users')
// const data = await response.json()
// setUsers(data.result)

// With:
const response = await fetch('http://localhost:3000/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
const data = await response.json()
setUsers(data.result)
```

## Styling

The application uses Tailwind CSS for styling with a consistent design system:

- **Colors**: Blue (primary), Green (success), Red (error), Purple (Auth0), Gray (neutral)
- **Layout**: Responsive grid system, max-width containers
- **Components**: Cards, tables, forms, buttons, alerts, modals
- **Spacing**: Consistent padding and margins
- **Typography**: Bold headings, readable body text

## Notes

- The app is fully responsive and works on mobile, tablet, and desktop
- All forms include proper validation
- Loading states prevent multiple submissions
- Error messages are user-friendly
- The Health page auto-refreshes to show current status



http://localhost:3000/api/v1/endpoint