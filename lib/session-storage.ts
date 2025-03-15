import type { Session } from "@/types/chat"

const SESSION_STORAGE_KEY = "screenshot-analyzer-session"

export function saveSession(session: Session | null): void {
  if (typeof window === "undefined") return

  if (session === null) {
    localStorage.removeItem(SESSION_STORAGE_KEY)
  } else {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  }
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null

  const savedSession = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!savedSession) return null

  try {
    return JSON.parse(savedSession) as Session
  } catch (error) {
    console.error("Failed to parse saved session:", error)
    return null
  }
}

