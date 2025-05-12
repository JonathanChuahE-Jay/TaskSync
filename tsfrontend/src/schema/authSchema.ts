import { z } from 'zod'

export const emailSchema = z
	.string()
	.min(1, 'Email is required')
	.email('Invalid email format')

export const passwordSchema = z
	.string()
	.min(8, 'Password must be at least 8 characters')
	.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
	.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
	.regex(/[0-9]/, 'Password must contain at least one number')

export const usernameSchema = z
	.string()
	.min(3, 'Username must be at least 3 characters')
	.max(20, 'Username cannot be more than 20 characters')
	.regex(
		/^[a-zA-Z0-9_]+$/,
		'Username can only contain letters, numbers, and underscores',
	)

export const nameSchema = z
	.string()
	.min(1, 'This field is required')
	.max(50, 'Name cannot be more than 50 characters')

export const phoneSchema = z
	.string()
	.min(8, 'Must be a valid phone number')
	.regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')

export const otpSchema = z
	.string()
	.length(6, 'OTP must be 6 digits')
	.regex(/^\d+$/, 'OTP must contain only numbers')

export const step1Schema = z
	.object({
		email: emailSchema,
		password: passwordSchema,
		password2: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.password2, {
		message: "Passwords don't match",
		path: ['password2'],
	})

export const step2Schema = z.object({
	username: usernameSchema,
	first_name: nameSchema,
	last_name: nameSchema,
	phone_number: phoneSchema,
})

export const step3Schema = z.object({
	otp: otpSchema,
})

export const step4Schema = z.object({
	agreeToTerms: z.boolean().refine((val) => val === true, {
		message: 'You must agree to the Terms and Conditions',
	}),
})

export const registerSchema = z
	.object({
		email: emailSchema,
		password: passwordSchema,
		password2: z.string(),
		username: usernameSchema,
		first_name: nameSchema,
		last_name: nameSchema,
		phone_number: phoneSchema,
		role: z.string().optional(),
		agreeToTerms: z.boolean(),
	})
	.refine((data) => data.password === data.password2, {
		message: "Passwords don't match",
		path: ['password2'],
	})
	.refine((data) => data.agreeToTerms === true, {
		message: 'You must agree to the Terms and Conditions',
		path: ['agreeToTerms'],
	})

export const loginSchema = z.object({
	username: usernameSchema,
	password: passwordSchema,
	rememberMe: z.boolean().optional(),
})