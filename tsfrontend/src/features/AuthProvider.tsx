// import { createContext, useContext, useEffect } from 'react'
// import type { LoginInput, RegisterInput } from '@/types/login.ts'
// import type { UserData } from '@/types/user.ts'
// import {
// 	useCurrentUser,
// 	useLogin,
// 	useLogout,
// 	useRegister,
// } from '@/queries/AuthQueries.tsx'
// import { useAuthStore } from '@/store/useAuthStore.tsx'
//
// interface AuthContextType {
// 	user: UserData | null
// 	isLoading: boolean
// 	isError: boolean
// 	isAuthenticated: boolean
// 	login: (credentials: LoginInput) => Promise<UserData>
// 	logout: () => Promise<void>
// 	register: (userData: RegisterInput) => Promise<UserData>
// }
//
// const AuthContext = createContext<AuthContextType | undefined>(undefined)
//
// export function AuthProvider({ children }: { children: React.ReactNode }) {
// 	const { data: user, isLoading, isError, status } = useCurrentUser()
// 	const loginMutation = useLogin()
// 	const logoutMutation = useLogout()
// 	const registerMutation = useRegister()
//
// 	const setUser = useAuthStore((state) => state.setUser)
// 	const clearUser = useAuthStore((state) => state.logout)
//
// 	useEffect(() => {
// 		if (user) {
// 			setUser(user)
// 		}
// 	}, [user, setUser])
//
// 	const handleLogin = async (credentials: LoginInput) => {
// 		const loggedInUser = await loginMutation.mutateAsync(credentials)
// 		setUser(loggedInUser)
// 		return loggedInUser
// 	}
//
// 	const handleLogout = async () => {
// 		await logoutMutation.mutateAsync()
// 		clearUser()
// 	}
//
// 	const handleRegister = async (userData: RegisterInput) => {
// 		const registeredUser = await registerMutation.mutateAsync(userData)
// 		setUser(registeredUser)
// 		return registeredUser
// 	}
//
// 	const value = {
// 		user: user || null,
// 		isLoading,
// 		isError,
// 		isAuthenticated: status === 'success' && !!user,
// 		login: handleLogin,
// 		logout: handleLogout,
// 		register: handleRegister,
// 	}
//
// 	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }
//
// export function useAuth() {
// 	const context = useContext(AuthContext)
//
// 	if (context === undefined) {
// 		throw new Error('useAuth must be used within an AuthProvider')
// 	}
//
// 	return context
// }
