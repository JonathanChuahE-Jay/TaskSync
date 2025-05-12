import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { IconLock, IconUser } from '@tabler/icons-react'
import { ZodError } from 'zod'
import type { ErrorResponse } from '@/types/errorResponse.ts'
import Input from '@/components/reusable/Input.tsx'
import Loader from '@/components/reusable/Loaders.tsx'
import LoginHeader from '@/components/auth/login/LoginHeader.tsx'
import ForgotPasswordLink from '@/components/auth/login/ForgotPasswordLink.tsx'
import LoginHr from '@/components/auth/login/LoginHr.tsx'
import LoginSocialMedia from '@/components/auth/login/LoginSocialMedia.tsx'
import LoginSignUpButton from '@/components/auth/login/LoginSugnUpButton.tsx'
import { useLogin } from '@/queries/AuthQueries.tsx'
import { loginSchema } from '@/schema/authSchema.ts'
import { useClickEnter } from '@/hooks/useClickEnter.tsx'
import { formatZodError } from '@/utils/convertZodToJson.ts'
import ErrorMessage from '@/components/reusable/ErrorMessage.tsx'
import { useClearFieldError } from '@/hooks/useClearFieldError.tsx'

const LoginForm = () => {
	const [isLoading, setIsLoading] = useState(false)
	const mutation = useLogin()
	const [apiErrors, setApiErrors] = useState<ErrorResponse>({})

	const clearFieldError = useClearFieldError(apiErrors, setApiErrors)

	const form = useForm({
		defaultValues: {
			username: '',
			password: '',
			rememberMe: false,
		},
		onSubmit: async ({ value }) => {
			try {
				setIsLoading(true)
				setApiErrors({})
				const user = loginSchema.parse(value)
				await mutation.mutateAsync(user)
				console.log('Login successful', user)
				setIsLoading(false)
			} catch (error) {
				setIsLoading(false)
				if (error instanceof ZodError) {
					setApiErrors(formatZodError(error))
				} else {
					const err = error as Error
					setApiErrors({ message: err.message || '' })
				}
			}
		},
	})

	useClickEnter(form.handleSubmit)

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="relative z-10 bg-white/40 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/50 p-8 w-[440px] max-w-[90%] overflow-hidden"
		>
			<div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />
			<div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
			<motion.div
				initial={{ scale: 0.9 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, duration: 0.4 }}
			>
				<LoginHeader />
				<form className="space-y-5">
					<form.Field
						name="username"
						children={(field) => (
							<Input
								label="Username"
								type="text"
								placeholder="Enter your username"
								icon={<IconUser className="size-5" />}
								value={field.state.value}
								onChange={(e) => {
									field.handleChange(e.target.value)
									clearFieldError(field.name)
								}}
								error={
									field.state.meta.errors[0] || apiErrors[field.name]
								}
								id="email"
							/>
						)}
					/>
					<form.Field
						name="password"
						children={(field) => (
							<Input
								label="Password"
								type="password"
								placeholder="•••••••••••••"
								icon={<IconLock className="size-5" />}
								value={field.state.value}
								onChange={(e) => {
									field.handleChange(e.target.value)
									clearFieldError(field.name)
								}}
								error={
									field.state.meta.errors[0] || apiErrors[field.name]
								}
								id="password"
							/>
						)}
					/>
					<div className="flex items-center justify-between pt-1">
						<form.Field
							name="rememberMe"
							children={(field) => (
								<Input
									label="Remember me"
									type="checkbox"
									placeholder=""
									icon={null}
									value={field.state.value}
									onChange={(e) => {
										field.handleChange(e.target.checked)
										clearFieldError(field.name)
									}}
									error={
										field.state.meta.errors[0] ||
										apiErrors[field.name]
									}
									id="remember"
								/>
							)}
						/>
						<ForgotPasswordLink />
					</div>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={form.handleSubmit}
						disabled={isLoading}
						className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                  text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30
                  transition duration-200 flex justify-center items-center"
						type="button"
					>
						{isLoading ? (
							<Loader
								dynamicText={true}
								sideBySide={true}
								label="Signing In"
								variant="bars"
							/>
						) : (
							'Sign In'
						)}
					</motion.button>
				</form>
				<ErrorMessage apiErrors={apiErrors} />
				<LoginHr />
				<LoginSocialMedia />
				<LoginSignUpButton />
			</motion.div>
		</motion.div>
	)
}

export default LoginForm
