import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'
import type { UserData } from '@/types/user'
import { authApi } from '@/services/authServices'

interface AuthState {
	user: UserData | null
	isInitializing: boolean
	isInitialized: boolean
	isRefreshing: boolean
	isAuthenticated: boolean
	error: string | null
	login: (
		username: string,
		password: string,
		rememberMe: boolean,
	) => Promise<boolean>
	refresh: () => Promise<boolean>
	verify: () => Promise<boolean>
	logout: () => void
	init: () => Promise<boolean>
	setUser: (userData: UserData) => void
	setError: (error: string) => void
	clearError: () => void
	decodeUser: (token: string) => UserData | null
	resetState: () => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
	user: null,
	isInitializing: true,
	isInitialized: false,
	isRefreshing: false,
	isAuthenticated: false,
	error: null,

	login: async (username, password, rememberMe) => {
		get().clearError()
		const response = await authApi.login({
			username,
			password,
			rememberMe,
		})
		set({
			user: response,
			isAuthenticated: true,
		})
		return true
	},

	refresh: async () => {
		set({ isRefreshing: true })
		try {
			await authApi.refreshToken()
			const userData = await authApi.getCurrentUser()
			set({
				user: userData,
				isAuthenticated: true,
				isRefreshing: false,
			})
			return true
		} catch (error) {
			get().setError('Session refresh failed')
			set({ isRefreshing: false })
			return false
		}
	},

	verify: async () => {
		try {
			return await authApi.verify()
		} catch (e){
			return false
		}
	},

	init: async () => {
		if (get().isInitialized) return true
		try {
			const userData = await authApi.getCurrentUser()
			set({
				user: userData,
				isAuthenticated: true,
			})
		} catch (error) {
			console.error('Error fetching user data:', error)
			const refreshed = await get().refresh()
			if (!refreshed) {
				get().resetState()
			}
		}
		set({ isInitialized: true, isInitializing: false })
		return get().isAuthenticated
	},

	setUser: (userData) => {
		set({
			user: userData,
			isAuthenticated: true,
		})
	},

	logout: async () => {
		try {
			await authApi.logout()
		} catch (error) {
			console.error('Logout API error:', error)
		}
		get().resetState()
	},

	decodeUser: (token: string): UserData | null => {
		try {
			const decoded: any = jwtDecode(token)
			return {
				id: decoded.user_id,
				email: decoded.email,
				username: decoded.username,
				role: decoded.role,
				phone_number: decoded.phone_number,
				first_name: decoded.first_name || '',
				last_name: decoded.last_name || '',
			}
		} catch {
			return null
		}
	},

	setError: (error) => set({ error, isAuthenticated: false }),
	clearError: () => set({ error: null }),

	resetState: () =>
		set({
			user: null,
			isAuthenticated: false,
			isInitialized: true,
			isInitializing: false,
			isRefreshing: false,
			error: null,
		}),
}))
