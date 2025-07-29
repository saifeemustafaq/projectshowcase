// Hardcoded password hash (SHA-256 of "admin123" - replace with your desired password hash)
const PASSWORD_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

// Session management
const SESSION_STORAGE_KEY = 'project_showcase_session';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

export interface SessionData {
  token: string;
  expiresAt: number;
}

/**
 * Hash a password using SHA-256
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify password against the hardcoded hash
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const hashedInput = await hashPassword(password);
  return hashedInput === PASSWORD_HASH;
}

/**
 * Generate a session token
 */
export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Create a new session
 */
export function createSession(): SessionData {
  const token = generateSessionToken();
  const expiresAt = Date.now() + SESSION_DURATION;
  const sessionData = { token, expiresAt };
  
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  }
  
  return sessionData;
}

/**
 * Get current session
 */
export function getCurrentSession(): SessionData | null {
  if (typeof window === 'undefined') return null;
  
  const sessionString = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionString) return null;
  
  try {
    const session = JSON.parse(sessionString) as SessionData;
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    clearSession();
    return null;
  }
}

/**
 * Clear current session
 */
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return getCurrentSession() !== null;
}

/**
 * Extend session (reset expiration time)
 */
export function extendSession(): void {
  const currentSession = getCurrentSession();
  if (currentSession) {
    const extendedSession = {
      ...currentSession,
      expiresAt: Date.now() + SESSION_DURATION
    };
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(extendedSession));
    }
  }
}
