# Authentication System with Token Refresh

This authentication system automatically handles JWT token refresh when tokens expire, providing a seamless user experience.

## 🚀 Quick Start

### 1. Server-Side Authentication (Next.js App Router)

Your existing `getAuthStatus()` function now includes automatic token refresh:

```javascript
// In your layout.js or page.js
import { getAuthStatus } from "@/lib/auth";

export default async function Layout({ children }) {
  const user = await getAuthStatus(); // Now handles token refresh automatically

  return (
    <AuthProvider initialUser={user}>{/* Your layout content */}</AuthProvider>
  );
}
```

### 2. Client-Side Authentication (React Components)

```jsx
"use client";
import { useAuth } from "@/hooks/useAuth";

export default function MyComponent() {
  const { isAuthenticated, user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 3. Making Authenticated API Calls

```jsx
"use client";
import { useApiRequest } from "@/utils/apiRequest";

export default function MyComponent() {
  const { get, post, put, delete: del } = useApiRequest();

  const fetchData = async () => {
    try {
      // Automatically handles token refresh if needed
      const response = await get("/api/users/profile");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      // Automatically handles token refresh if needed
      const response = await post("/api/users/profile", profileData);
      const result = await response.json();
      console.log("Updated:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Profile</button>
      <button onClick={() => updateProfile({ name: "John" })}>
        Update Profile
      </button>
    </div>
  );
}
```

### 4. Protected Pages

```jsx
"use client";
import AuthenticatedPage from "@/components/AuthenticatedPage";

export default function ProfilePage() {
  return (
    <AuthenticatedPage requireAuth={true}>
      <div>
        <h1>User Profile</h1>
        {/* Your protected content */}
      </div>
    </AuthenticatedPage>
  );
}
```

## 🔧 How It Works

### Token Refresh Flow

1. **Automatic Detection**: When a JWT token expires, the system detects the `TokenExpiredError`
2. **Background Refresh**: Automatically calls the `/refresh-token` endpoint
3. **Retry Request**: If refresh succeeds, retries the original request
4. **Fallback**: If refresh fails, redirects user to login page

### Components Overview

- **`getAuthStatus()`**: Server-side auth check with token refresh
- **`useAuth()`**: Client-side auth hook with state management
- **`useApiRequest()`**: Hook for making authenticated API calls
- **`AuthProvider`**: Wrapper component for auth state management
- **`AuthenticatedPage`**: Component for protecting pages

### Automatic Features

- ✅ **Auto-refresh**: Tokens refresh every 14 minutes
- ✅ **Retry Logic**: Failed requests are retried after token refresh
- ✅ **Error Handling**: Graceful fallback to login page
- ✅ **Real-time**: Handles token expiry across browser tabs
- ✅ **Seamless UX**: No interruption to user experience

## 🛠️ Configuration

### Environment Variables

Make sure you have these in your `.env.local`:

```env
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NEXT_PUBLIC_BACKEND_URL=your_backend_url
```

### Backend Requirements

Your backend should have these endpoints:

- `POST /api/users/refresh-token` - Refresh access token
- `GET /api/users/validate-token` - Validate current token
- `POST /api/users/logout` - Logout user

## 🐛 Troubleshooting

### Common Issues

1. **"TokenExpiredError: jwt expired"**

   - ✅ **Fixed**: The system now automatically refreshes expired tokens

2. **Infinite redirect loops**

   - Check that your refresh token endpoint is working
   - Verify environment variables are set correctly

3. **CORS issues**
   - Ensure `credentials: "include"` is set in API calls
   - Backend should allow credentials in CORS settings

### Debugging

Enable detailed logging by checking browser console:

- 🪙 `accessToken:` - Shows current token
- 🔄 `Token expired, attempting refresh...` - Refresh in progress
- ✅ `Token refreshed successfully` - Refresh completed
- ❌ `Token refresh failed` - Need to login again

## 📝 Migration Guide

If you're upgrading from the old system:

1. **Update imports**:

   ```jsx
   // Old
   import { getAuthStatus } from "@/lib/auth";

   // New (same import, but now includes refresh)
   import { getAuthStatus } from "@/lib/auth";
   ```

2. **Replace manual API calls**:

   ```jsx
   // Old
   const response = await fetch("/api/endpoint", {
     headers: { Authorization: `Bearer ${token}` },
   });

   // New
   const { get } = useApiRequest();
   const response = await get("/api/endpoint");
   ```

3. **Add AuthProvider to layout**:
   ```jsx
   // Wrap your layout content
   <AuthProvider initialUser={user}>{children}</AuthProvider>
   ```

That's it! Your authentication system now handles token refresh automatically. 🎉
