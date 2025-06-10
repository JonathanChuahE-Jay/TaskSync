import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { IconLock, IconUser } from '@tabler/icons-react'
import { ZodError } from 'zod'
import type { ErrorResponse } from '@/types/errorResponse.ts'
import LoginHeader from '@/components/auth/login/LoginHeader.tsx'
import ForgotPasswordLink from '@/components/auth/login/ForgotPasswordLink.tsx'
import LoginHr from '@/components/auth/login/LoginHr.tsx'
import LoginSocialMedia from '@/components/auth/login/LoginSocialMedia.tsx'
import LoginSignUpButton from '@/components/auth/login/LoginSugnUpButton.tsx'
import { loginSchema } from '@/schema/authSchema.ts'
import { useClickEnter } from '@/hooks/useClickEnter.tsx'
import { formatZodError } from '@/utils/convertZodToJson.ts'
import ErrorMessage from '@/components/reusable/ErrorMessage.tsx'
import { useClearFieldError } from '@/hooks/useClearFieldError.tsx'
import { useDefaultAppForm } from '@/components/common/defaultForm/DefaultAppForm.tsx'
import { useAuthStore } from '@/store/useAuthStore.tsx'
import AuthModal from '@/components/common/AuthModal.tsx'

const LoginForm = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [apiErrors, setApiErrors] = useState<ErrorResponse>({})
	const clearFieldError = useClearFieldError(apiErrors, setApiErrors)

	const { login, error: authError, clearError } = useAuthStore()

	useEffect(() => {
		if (authError) {
			setApiErrors({ message: authError })
			clearError()
		}
	}, [authError, clearError])

	const form = useDefaultAppForm({
		defaultValues: {
			username: '',
			password: '',
			rememberMe: false,
		},
		onSubmit: async ({ value }) => {
			try {
				setIsLoading(true)
				setApiErrors({})

				const userData = loginSchema.parse(value)

				const success = await login(
					userData.username,
					userData.password,
					userData.rememberMe,
				)

				if (success) {
					console.log('Login successful')
				}

				setIsLoading(false)
			} catch (error) {
				console.log(error)
				setIsLoading(false)
				if (error instanceof ZodError) {
					setApiErrors(formatZodError(error))
				} else {
					const err = error as Error
					setApiErrors({ message: err.message || 'Login failed' })
				}
			}
		},
	})

	useClickEnter(form.handleSubmit)

	return (
		<AuthModal>
			<motion.div
				initial={{ scale: 0.9 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, duration: 0.4 }}
			>
				<LoginHeader />
				<form className="space-y-5">
					<form.AppField name="username">
						{(field) => (
							<field.InputField
								label="Username"
								placeholder="Enter your username"
								prefix={<IconUser className="size-5" />}
								clearFieldError={clearFieldError}
								apiErrors={apiErrors}
							/>
						)}
					</form.AppField>
					<form.AppField
						name="password"
						children={(field) => (
							<field.InputField
								label="Password"
								type="password"
								placeholder="•••••••••••••"
								prefix={<IconLock className="size-5" />}
								value={field.state.value}
								clearFieldError={clearFieldError}
								apiErrors={apiErrors}
							/>
						)}
					/>
					<div className="flex items-center justify-between pt-1">
						<form.AppField
							name="rememberMe"
							children={(field) => (
								<field.InputField
									label="Remember me"
									type="checkbox"
									placeholder=""
									prefix={null}
									value={field.state.value}
									clearFieldError={clearFieldError}
									apiErrors={apiErrors}
								/>
							)}
						/>
						<ForgotPasswordLink />
					</div>
					<form.AppForm>
						<form.SubmitButton
							label="Login"
							loadingLabel="Signing In"
							dynamicText={true}
							sideBySide={true}
							variant="bars"
							isLoading={isLoading}
						/>
					</form.AppForm>
				</form>
				<ErrorMessage apiErrors={apiErrors} />
				<LoginHr />
				<LoginSocialMedia />
				<LoginSignUpButton />
			</motion.div>
		</AuthModal>
	)
}

export default LoginForm
