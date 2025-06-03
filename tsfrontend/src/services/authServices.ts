import type {
	LoginInput,
	OtpResponse,
	RegisterInput,
	ValidationResponse,
} from '@/types/login.ts'
import type { UserData } from '@/types/user.ts'
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

	sendOtp: async (email: string): Promise<OtpResponse> => {
		try {
			return await kyInstance
				.post('send-otp/', {
					json: { email: email },
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	resendOtp: async (email: string): Promise<OtpResponse> => {
		try {
			return await kyInstance
				.post('resend-otp/', {
					json: { email: email },
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	verifyOtp: async (
		email: string,
		otp: string,
	): Promise<ValidationResponse> => {
		try {
			return await kyInstance
				.post('verify-otp/', {
					json: {
						email: email,
						otp,
					},
				})
				.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},
	verify: async (): Promise<boolean> => {
    try {
        const cookies = document.cookie;
        if (!cookies.includes('access_token')) {
            return false;
        }

        await kyInstance.post('verify/')
        return true
    } catch (err) {
        console.error('Token verification failed:', err)
        return await handleKyError(err)
    }
},
	refreshToken: async (): Promise<void> => {
		try {
			await kyInstance.post('refresh/')
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
			return await kyInstance.get('me/').json<UserData>()
		} catch (err) {
			return await handleKyError(err)
		}
	},
}
