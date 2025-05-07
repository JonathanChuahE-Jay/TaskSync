import { useMutation, useQuery } from '@tanstack/react-query'
import Axios from '@/lib/axios.tsx'
import { queryClient } from '@/lib/tanstack.ts'
import type { LoginInput, OtpResponse, RegisterInput, UserData, ValidationResponse } from '@/types/login.ts'


const authApi = {
	validateEmail: async (email: string): Promise<ValidationResponse> => {
		const response = await Axios.post('/validate-email/', { email })
		console.log(response)
		return response.data
	},

	validatePassword: async (password: string): Promise<ValidationResponse> => {
		const response = await Axios.post('/validate-password/', { password })
		return response.data
	},

	validateUsername: async (username: string): Promise<ValidationResponse> => {
		const response = await Axios.post('/validate-username/', { username })
		return response.data
	},

	validatePhone: async (phoneNumber: string): Promise<ValidationResponse> => {
		const response = await Axios.post('/validate-phone/', {
			phone_number: phoneNumber,
		})
		return response.data
	},

	sendOtp: async (phoneNumber: string): Promise<OtpResponse> => {
		const response = await Axios.post('/send-otp/', {
			phone_number: phoneNumber,
		})
		return response.data
	},

	resendOtp: async (phoneNumber: string): Promise<OtpResponse> => {
		const response = await Axios.post('/resend-otp/', {
			phone_number: phoneNumber,
		})
		return response.data
	},

	verifyOtp: async (
		phoneNumber: string,
		otp: string,
	): Promise<ValidationResponse> => {
		const response = await Axios.post('/verify-otp/', {
			phone_number: phoneNumber,
			otp,
		})
		return response.data
	},

	register: async (userData: RegisterInput): Promise<UserData> => {
		const response = await Axios.post('/register/', userData)
		return response.data
	},

	login: async (credentials: LoginInput): Promise<UserData> => {
		const response = await Axios.post('/login/', credentials)
		return response.data
	},

	logout: async (): Promise<void> => {
		await Axios.post('/logout/')
	},

	getCurrentUser: async (): Promise<UserData> => {
		const response = await Axios.get('/me/')
		return response.data
	},
}

export function useValidateEmail() {
	return useMutation({
		mutationFn: authApi.validateEmail,
	})
}

export function useValidatePassword() {
	return useMutation({
		mutationFn: authApi.validatePassword,
	})
}

export function useValidateUsername() {
	return useMutation({
		mutationFn: authApi.validateUsername,
	})
}

export function useValidatePhone() {
	return useMutation({
		mutationFn: authApi.validatePhone,
	})
}

export function useSendOtp() {
	return useMutation({
		mutationFn: authApi.sendOtp,
	})
}

export function useResendOtp() {
	return useMutation({
		mutationFn: authApi.resendOtp,
	})
}

export function useVerifyOtp() {
	return useMutation({
		mutationFn: ({
			phoneNumber,
			otp,
		}: {
			phoneNumber: string
			otp: string
		}) => authApi.verifyOtp(phoneNumber, otp),
	})
}

export function useRegister() {
	return useMutation({
		mutationFn: authApi.register,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['currentUser'] })
		},
	})
}

export function useLogin() {
	return useMutation({
		mutationFn: authApi.login,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['currentUser'] })
		},
	})
}

export function useLogout() {
	return useMutation({
		mutationFn: authApi.logout,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['currentUser'] })
			queryClient.clear()
		},
	})
}

export function useCurrentUser() {
	return useQuery({
		queryKey: ['currentUser'],
		queryFn: authApi.getCurrentUser,
		retry: 1,
		staleTime: 10 * 60 * 1000,
		gcTime: 15 * 60 * 1000,
	})
}

export default authApi
