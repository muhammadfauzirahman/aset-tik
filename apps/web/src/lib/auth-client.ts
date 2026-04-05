import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001", // Backend URL
  fetchOptions: {
    disableFocus: true // Prevents auto-refresh on window focus which resets the UI
  }
})
