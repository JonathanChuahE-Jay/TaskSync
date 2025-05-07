import type { ErrorApiResponse } from '@/types/errorResponse.ts'
import type { Dispatch, SetStateAction } from 'react'

export interface ValidationResponse {
	valid: boolean
	message: string
}

export interface OtpResponse {
	success: boolean
	message: string
}

export interface UserData {
	id: number
	username: string
	email: string
	first_name: string
	last_name: string
	phone_number: string
	role: string
	is_phone_verified: boolean
}

export interface RegisterInput {
	username: string
	email: string
	password: string
	password2: string
	first_name: string
	last_name: string
	phone_number: string
	role?: string
	agreeToTerms?: boolean
}

export interface LoginInput {
	username: string
	password: string
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
	apiErrors: ErrorApiResponse
	form: any
	setApiErrors: Dispatch<SetStateAction<ErrorApiResponse>>
	isLoading: boolean
}
