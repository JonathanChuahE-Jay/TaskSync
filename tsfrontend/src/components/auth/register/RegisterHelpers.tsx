import { ZodError } from 'zod'
import { useRouter } from '@tanstack/react-router'
import {
	registerSchema,
	step1Schema,
	step2Schema,
	step3Schema,
	step4Schema,
} from '@/schema/authSchema.ts'
import { formatZodError } from '@/utils/convertZodToJson.ts'
import {
	useRegister,
	useResendOtp,
	useSendOtp,
	useValidateEmail,
	useValidatePassword,
	useValidatePhone,
	useValidateUsername,
	useVerifyOtp,
} from '@/queries/AuthQueries.ts'
import { useDefaultAppForm } from '@/components/common/defaultForm/DefaultAppForm.tsx'
import { cleanObject } from '@/utils/removeNullKeys.ts'
import { useStepperStore } from '@/store/useStepperStore.tsx'
import { registerFormHelper } from '@/components/auth/register/registerFormHelper.tsx'

interface ValidationStepsProps {
	setApiErrors: (errors: any) => void
	setStepValidation: (steps: Array<boolean>) => void
	setIsOtpSent: (sent: boolean) => void
	stepValidation: Array<boolean>
	otpValue: string
}

const registerHelpers = ({
	setApiErrors,
	setStepValidation,
	setIsOtpSent,
	stepValidation,
	otpValue,
}: ValidationStepsProps) => {
	const router = useRouter()
	const { goToStep } = useStepperStore()
	const registerMutation = useRegister()

	const validateEmailMutation = useValidateEmail()
	const validatePasswordMutation = useValidatePassword()
	const validateUsernameMutation = useValidateUsername()
	const validatePhoneMutation = useValidatePhone()
	const sendOtpMutation = useSendOtp()
	const resendOtpMutation = useResendOtp()
	const verifyOtpMutation = useVerifyOtp()

	const isLoading =
		validateEmailMutation.isPending ||
		validatePasswordMutation.isPending ||
		validateUsernameMutation.isPending ||
		validatePhoneMutation.isPending ||
		sendOtpMutation.isPending ||
		resendOtpMutation.isPending ||
		verifyOtpMutation.isPending

	const form = useDefaultAppForm({
		...registerFormHelper,
		onSubmit: async ({ value }) => {
			try {
				const registrationData = {
					username: value.username,
					email: value.email,
					password: value.password,
					password2: value.password2,
					first_name: value.first_name,
					last_name: value.last_name,
					phone_number: value.phone_number || '',
					role: value.role,
					agreeToTerms: value.agreeToTerms,
				}
				const user = registerSchema.parse(registrationData)
				await registerMutation.mutateAsync(cleanObject(user))
				const newValidation = [...stepValidation]
				newValidation[3] = true
				newValidation[4] = true
				setStepValidation(newValidation)
				goToStep(steps.length)

				setTimeout(() => {
					router.navigate({ to: '/login' })
					form.reset()
					setApiErrors({})
				}, 3000)
				console.log('Registration successful', user)
			} catch (error: any) {
				if (error instanceof ZodError) {
					setApiErrors(formatZodError(error))
				} else {
					setApiErrors(error.message)
				}
			}
		},
	})

	const validateStep1 = async () => {
		setApiErrors({})
		try {
			const email = form.getFieldValue('email')
			const password = form.getFieldValue('password')
			const password2 = form.getFieldValue('password2')
			const step1Data = { email, password, password2 }
			const result = step1Schema.parse(step1Data)
			await validateEmailMutation.mutateAsync(result.email)
			await validatePasswordMutation.mutateAsync(password)
			const newValidation = [...stepValidation]
			newValidation[0] = true
			setStepValidation(newValidation)
			return true
		} catch (error: any) {
			console.error('Step 1 validation error:', error)
			if (error instanceof ZodError) {
				setApiErrors(formatZodError(error))
			} else {
				setApiErrors(error.message)
			}
			return false
		}
	}

	const validateStep2 = async () => {
		setApiErrors({})
		try {
			const username = form.getFieldValue('username')
			const firstName = form.getFieldValue('first_name')
			const lastName = form.getFieldValue('last_name')
			const phoneNumber = form.getFieldValue('phone_number')
			const email = form.getFieldValue('email')
			const step2Data = {
				username,
				first_name: firstName,
				last_name: lastName,
				phone_number: phoneNumber,
			}
			const result = step2Schema.parse(step2Data)
			await validateUsernameMutation.mutateAsync(result.username)
			if (result.phone_number && result.phone_number.length > 0) {
				await validatePhoneMutation.mutateAsync(result.phone_number)
			}
			const otpResponse = await sendOtpMutation.mutateAsync(email)
			if (!otpResponse.success) {
				setApiErrors((prev: any) => ({
					...prev,
					phone_number: otpResponse.message,
				}))
				return false
			}
			setIsOtpSent(true)
			const newValidation = [...stepValidation]
			newValidation[1] = true
			setStepValidation(newValidation)
			return true
		} catch (error: any) {
			console.error('Step 2 validation error:', error)
			if (error instanceof ZodError) {
				setApiErrors(formatZodError(error))
			} else {
				setApiErrors(error.message)
			}
			return false
		}
	}

	const validateStep3 = async () => {
		setApiErrors({})
		try {
			step3Schema.parse({ otp: otpValue })
			const email = form.getFieldValue('email')
			await verifyOtpMutation.mutateAsync({
				email,
				otp: otpValue,
			})
			const newValidation = [...stepValidation]
			newValidation[2] = true
			setStepValidation(newValidation)
			return true
		} catch (error: any) {
			console.error('Step 3 validation error:', error)
			if (error instanceof ZodError) {
				setApiErrors(formatZodError(error))
			} else {
				setApiErrors(error.message)
			}
			return false
		}
	}

	const validateStep4 = () => {
		setApiErrors({})
		try {
			const agreeToTerms = form.getFieldValue('agreeToTerms')
			step4Schema.parse({ agreeToTerms })
			return true
		} catch (error: any) {
			console.error('Step 4 validation error:', error)
			if (error instanceof ZodError) {
				setApiErrors(formatZodError(error))
			} else {
				setApiErrors(error.message)
			}
			return false
		}
	}

	const handleResendOtp = async () => {
		setApiErrors({})
		try {
			const email = form.getFieldValue('email')
			await resendOtpMutation.mutateAsync(email)
		} catch (error: any) {
			console.error('OTP resend error:', error)
			setApiErrors(error.message)
		}
	}

	const handleNextClick = async (step: number) => {
		switch (step) {
			case 1:
				return await validateStep1()
			case 2:
				return await validateStep2()
			case 3:
				return await validateStep3()
			case 4:
				return validateStep4()
			default:
				return true
		}
	}

	const steps = [
		{ label: 'Account' },
		{ label: 'Profile' },
		{ label: 'Verify' },
		{ label: 'Complete' },
		{ label: 'Completed' },
	]

	return {
		form,
		validateStep1,
		validateStep2,
		validateStep3,
		validateStep4,
		handleResendOtp,
		handleNextClick,
		steps,
		isLoading,
	}
}

export default registerHelpers
