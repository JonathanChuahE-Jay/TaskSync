import { IconLock, IconMail } from '@tabler/icons-react'
import { useState } from 'react'
import type {
	CommonStepSection,
	FormField,
	FormSubscriptionState,
} from '@/types/login.ts'
import Input from '@/components/reusable/Input.tsx'
import { usePasswordValidation } from '@/hooks/usePasswordValidation'
import PasswordValidationFeedback from '@/components/auth/register/stepSections/registerAccount/PasswordValidationFeedback.tsx'

const RegisterAccount = ({
	apiErrors,
	form,
	setApiErrors,
	isLoading,
}: CommonStepSection) => {
	const [passwordValue, setPasswordValue] = useState('')

	const validations = usePasswordValidation(passwordValue)
	return (
		<div className="space-y-5">
			<form.Field
				name="email"
				children={(field: FormField) => (
					<form.Subscribe
						selector={(state: FormSubscriptionState) => ({
							value: state.values[field.name],
							error: field.state.meta.errors[0] ||  apiErrors[field.name],
						})}
					>
						{(state: FormSubscriptionState) => (
							<Input
								label="Email Address"
								type="email"
								placeholder="Enter your email"
								icon={<IconMail className="size-5" />}
								value={state.value}
								onChange={(e) => {
									field.handleChange(e.target.value)
									if (apiErrors[field.name]) {
										setApiErrors((prev) => ({
											...prev,
											[field.name]: '',
										}))
									}
								}}
								error={state.error}
								id="email"
								disabled={isLoading}
							/>
						)}
					</form.Subscribe>
				)}
			/>
			<form.Field
				name="password"
				children={(field: FormField) => (
					<form.Subscribe
						selector={(state: FormSubscriptionState) => ({
							value: state.values[field.name],
							error: field.state.meta.errors[0] ||  apiErrors[field.name],
						})}
					>
						{(state: FormSubscriptionState) => (
							<Input
								label="Password"
								type="password"
								placeholder="•••••••••••••"
								icon={<IconLock className="size-5" />}
								value={state.value}
								onChange={(e) => {
									const newValue = e.target.value
									field.handleChange(newValue)
									setPasswordValue(newValue)
									if (apiErrors[field.name]) {
										setApiErrors((prev) => ({
											...prev,
											[field.name]: '',
										}))
									}
								}}
								error={state.error}
								id="password"
								disabled={isLoading}
							/>
						)}
					</form.Subscribe>
				)}
			/>
			<form.Field
				name="password2"
				children={(field: FormField) => (
					<form.Subscribe
						selector={(state: FormSubscriptionState) => ({
							value: state.values[field.name],
							error: field.state.meta.errors[0] ||  apiErrors[field.name],
						})}
					>
						{(state: FormSubscriptionState) => (
							<Input
								label="Confirm Password"
								type="password"
								placeholder="•••••••••••••"
								icon={<IconLock className="size-5" />}
								value={state.value}
								onChange={(e) => {
									field.handleChange(e.target.value)
									if (apiErrors[field.name]) {
										setApiErrors((prev) => ({
											...prev,
											[field.name]: '',
										}))
									}
								}}
								error={state.error}
								id="confirmPassword"
								disabled={isLoading}
							/>
						)}
					</form.Subscribe>
				)}
			/>
			<PasswordValidationFeedback validations={validations} />
		</div>
	)
}

export default RegisterAccount
