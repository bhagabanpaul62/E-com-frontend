"use client";

import { useAuth } from "@/hooks/useAuth";
import { useApiRequest } from "@/utils/apiRequest";
import { useState, useEffect } from "react";

// Example component showing how to use the new auth system
export default function ExampleAuthenticatedComponent() {
  const { isAuthenticated, user, loading, logout } = useAuth();
  const { get, post } = useApiRequest();
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // Example: Fetch authenticated data
  const fetchProtectedData = async () => {
    try {
      setLoadingData(true);

      // This will automatically handle token refresh if needed
      const response = await get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/protected-endpoint`
      );

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  // Example: Make a POST request
  const handleSubmit = async (formData) => {
    try {
      // This will automatically handle token refresh if needed
      const response = await post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/some-endpoint`,
        formData
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
      } else {
        console.error("Failed to submit");
      }
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProtectedData();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center p-4">
        <p>Please login to access this content.</p>
        <a href="/login" className="text-primary underline">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Welcome, {user?.name || "User"}!
      </h2>

      <div className="mb-4">
        <button
          onClick={fetchProtectedData}
          disabled={loadingData}
          className="bg-primary text-white px-4 py-2 rounded mr-2"
        >
          {loadingData ? "Loading..." : "Fetch Data"}
        </button>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {data && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold">Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

/*
USAGE INSTRUCTIONS:

1. For Server Components (layouts, pages):
   - Use the updated getAuthStatus() which now handles token refresh
   - Wrap your layout with AuthProvider for client-side auth management

2. For Client Components:
   - Use the useAuth() hook to get authentication state
   - Use useApiRequest() or apiRequest() for making authenticated API calls
   - These will automatically handle token refresh when needed

3. For Protected Pages:
   - Wrap your page content with AuthenticatedPage component
   - Or use useAuth() hook and check isAuthenticated state

4. Example API Call:
   ```jsx
   const { get, post } = useApiRequest();
   
   // GET request
   const response = await get('/api/users/profile');
   
   // POST request
   const response = await post('/api/users/update', { name: 'John' });
   ```

5. The system will:
   - Automatically refresh tokens when they expire
   - Retry failed requests after refreshing tokens
   - Redirect to login if refresh fails
   - Set up automatic token refresh every 14 minutes
*/
