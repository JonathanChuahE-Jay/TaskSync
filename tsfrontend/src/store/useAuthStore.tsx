import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user: string) => set({ user }),
  logout: () => set({ user: null }),
}))

export default useAuthStore


/*
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'
import type { UserData } from '@/types/user'
import { kyInstance } from '@/lib/ky'

interface AuthState {
	user: UserData | null
	accessToken: string | null
	refreshToken: string | null

	isInitializing: boolean
	isInitialized: boolean
	isRefreshing: boolean
	isAuthenticated: boolean
	error: string | null

	login: (email: string, password: string) => Promise<boolean>
	refresh: () => Promise<boolean>
	verify: () => Promise<boolean>
	logout: () => void
	init: () => Promise<boolean>
	setLoginData: (data: { access: string; refresh: string }) => void
	setError: (error: string) => void
	clearError: () => void
	decodeUser: (token: string) => UserData | null
	resetState: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			accessToken: null,
			refreshToken: null,

			isInitializing: true,
			isInitialized: false,
			isRefreshing: false,
			isAuthenticated: false,
			error: null,

			login: async (email, password) => {
				get().clearError()
				try {
					const res = await kyInstance
						.post('login/', { json: { email, password } })
						.json<{ access: string; refresh: string }>()

					get().setLoginData(res)
					return true
				} catch (error) {
					get().setError('Login failed')
					return false
				}
			},

			refresh: async () => {
				const { refreshToken } = get()
				if (!refreshToken) return false

				set({ isRefreshing: true })

				try {
					const res = await kyInstance
						.post('refresh/', { json: { refresh: refreshToken } })
						.json<{ access: string }>()

					set({ accessToken: res.access, isRefreshing: false })
					const user = get().decodeUser(res.access)
					set({ user, isAuthenticated: true })
					return true
				} catch (error) {
					get().setError('Token refresh failed')
					set({ isRefreshing: false })
					return false
				}
			},

			verify: async () => {
				const { accessToken } = get()
				if (!accessToken) return false

				try {
					await kyInstance
						.post('verify/', { json: { token: accessToken } })
						.json()
					return true
				} catch {
					return false
				}
			},

			init: async () => {
				if (get().isInitialized) return true

				const { accessToken } = get()
				const verified = await get().verify()

				if (verified) {
					const user = get().decodeUser(accessToken!)
					set({ user, isAuthenticated: true })
				} else {
					const refreshed = await get().refresh()
					if (!refreshed) {
						get().logout()
						get().setError('Session expired')
					}
				}

				set({ isInitialized: true, isInitializing: false })
				return get().isAuthenticated
			},

			setLoginData: ({ access, refresh }) => {
				const user = get().decodeUser(access)
				set({
					user,
					accessToken: access,
					refreshToken: refresh,
					isAuthenticated: true,
				})
			},

			logout: () => {
				get().resetState()
			},

			decodeUser: (token) => {
				try {
					const decoded: any = jwtDecode(token)
					return {
						id: decoded.user_id,
						email: decoded.email,
						username: decoded.username,
						role: decoded.role,
						phone_number: decoded.phone_number,
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
					accessToken: null,
					refreshToken: null,
					isAuthenticated: false,
					isInitialized: false,
					isInitializing: false,
					isRefreshing: false,
					error: null,
				}),
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
			}),
		},
	),
)

 */