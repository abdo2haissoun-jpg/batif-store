// Helper to make authenticated admin API calls
export async function adminFetch(url: string, options: RequestInit = {}) {
  const token = sessionStorage.getItem('batif_admin_token')
  
  const headers: Record<string, string> = {}
  
  // Only set Content-Type for non-FormData requests
  // (FormData needs the browser to set it with the boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  
  // Copy any existing headers
  if (options.headers) {
    const existingHeaders = options.headers as Record<string, string>
    for (const [key, value] of Object.entries(existingHeaders)) {
      if (value) headers[key] = value
    }
  }
  
  // Pass token as Authorization header AND cookie
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
    // Also set as cookie for server-side verification
    document.cookie = `sb-access-token=${token}; path=/; max-age=3600; SameSite=Lax`
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })
}
