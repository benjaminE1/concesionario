import { createContext } from 'react'
import type { AuthUser, LoginDto } from '../types'

export interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  loading: boolean
  error: string | null
  login: (credentials: LoginDto) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
