import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/lib/tanstack.ts'
import { authApi } from '@/services/authServices.ts'

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
		mutationFn: ({ email, otp }: { email: string; otp: string }) =>
			authApi.verifyOtp(email, otp),
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

export function useVerify() {
	return useMutation({
		mutationFn: authApi.verify,
	})
}

export function useRefreshToken() {
	return useMutation({
		mutationFn: authApi.refreshToken,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['currentUser'] })
		},
		onError: () => {
			queryClient.removeQueries({ queryKey: ['currentUser'] })
		},
	})
}

export default authApi
