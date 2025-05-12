import type {
	LoginInput,
	OtpResponse,
	RegisterInput,
	UserData,
	ValidationResponse,
} from '@/types/login.ts'
import { kyInstance } from '@/lib/ky.ts'
import { handleKyError } from '@/utils/handleKyErrors.ts'

export const authApi = {
	validateEmail: async (email: string): Promise<ValidationResponse> => {
		try {
			return await kyInstance
				.post('validate-email/', {
					json: { email },
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	validatePassword: async (password: string): Promise<ValidationResponse> => {
		try {
			return await kyInstance
				.post('validate-password/', {
					json: { password },
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	validateUsername: async (username: string): Promise<ValidationResponse> => {
		try {
			return await kyInstance
				.post('validate-username/', {
					json: { username },
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	validatePhone: async (phoneNumber: string): Promise<ValidationResponse> => {
		try {
			return await kyInstance
				.post('validate-phone/', {
					json: { phone_number: phoneNumber },
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	sendOtp: async (phoneNumber: string): Promise<OtpResponse> => {
		try {
			return await kyInstance
				.post('send-otp/', {
					json: { phone_number: phoneNumber },
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	resendOtp: async (phoneNumber: string): Promise<OtpResponse> => {
		try {
			return await kyInstance
				.post('resend-otp/', {
					json: { phone_number: phoneNumber },
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	verifyOtp: async (
		phoneNumber: string,
		otp: string,
	): Promise<ValidationResponse> => {
		try {
			return await kyInstance
				.post('verify-otp/', {
					json: {
						phone_number: phoneNumber,
						otp,
					},
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	register: async (userData: RegisterInput): Promise<UserData> => {
		try {
			return await kyInstance
				.post('register/', {
					json: userData,
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	login: async (credentials: LoginInput): Promise<UserData> => {
		try {
			return await kyInstance
				.post('login/', {
					json: credentials,
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	logout: async (): Promise<void> => {
		try {
			await kyInstance.post('logout/', {
				json: {},
			})
		} catch (err) {
			return await handleKyError(err)
		}
	},

	getCurrentUser: async (): Promise<UserData> => {
		try {
			return await kyInstance.get('me/').json()
		} catch (err) {
			return await handleKyError(err)
		}
	},
}
