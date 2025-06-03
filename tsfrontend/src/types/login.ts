import type { ErrorResponse } from '@/types/errorResponse.ts'
import type { Dispatch, SetStateAction } from 'react'
import type { Role } from '@/types/user.ts'

export interface ValidationResponse {
	valid: boolean
	message: string
}

export interface OtpResponse {
	success: boolean
	message: string
}

export interface RegisterInput {
	username: string
	email: string
	password: string
	password2: string
	first_name: string
	last_name: string
	phone_number?: string | undefined
	role: Role
	agreeToTerms?: boolean
}

export interface LoginInput {
	username: string
	password: string
	rememberMe: boolean
}

export interface FormField {
	name: keyof RegisterInput
	state: {
		meta: {
			errors: Array<string>
		}
	}
	handleChange: (value: string | boolean) => void
}

export interface FormSubscriptionState {
	value: string | boolean
	error: string | undefined
}

export interface FormSubscriptionState {
	values: RegisterInput
}

export interface CommonStepSection {
	apiErrors: ErrorResponse
	form: any
	setApiErrors: Dispatch<SetStateAction<ErrorResponse>>
	isLoading: boolean
}
