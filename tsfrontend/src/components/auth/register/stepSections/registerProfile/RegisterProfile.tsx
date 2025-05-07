import { IconAt, IconPhone, IconUser } from '@tabler/icons-react'
import type {
	CommonStepSection,
	FormField,
	FormSubscriptionState,
} from '@/types/login.ts'
import Input from '@/components/reusable/Input.tsx'

const RegisterProfile = ({
	form,
	apiErrors,
	setApiErrors,
	isLoading,
}: CommonStepSection) => {
	return (
		<div className="space-y-5">
			<form.Field
				name="username"
				children={(field: FormField) => (
					<form.Subscribe
						selector={(state: FormSubscriptionState) => ({
							value: state.values[field.name],
							error: field.state.meta.errors[0] || apiErrors[field.name],
						})}
					>
						{(state: FormSubscriptionState) => (
							<Input
								label="Username"
								type="text"
								placeholder="Choose a unique username"
								icon={<IconAt className="size-5" />}
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
								id="username"
								disabled={isLoading}
							/>
						)}
					</form.Subscribe>
				)}
			/>

			<form.Field
				name="first_name"
				children={(field: FormField) => (
					<form.Subscribe
						selector={(state: FormSubscriptionState) => ({
							value: state.values[field.name],
							error: field.state.meta.errors[0] || apiErrors[field.name],
						})}
					>
						{(state: FormSubscriptionState) => (
							<Input
								label="First Name"
								type="text"
								placeholder="Enter your first name"
								icon={<IconUser className="size-5" />}
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
								id="firstName"
								disabled={isLoading}
							/>
						)}
					</form.Subscribe>
				)}
			/>

			<form.Field
				name="last_name"
				children={(field: FormField) => (
					<form.Subscribe
						selector={(state: FormSubscriptionState) => ({
							value: state.values[field.name],
							error: field.state.meta.errors[0] || apiErrors[field.name],
						})}
					>
						{(state: FormSubscriptionState) => (
							<Input
								label="Last Name"
								type="text"
								placeholder="Enter your last name"
								icon={<IconUser className="size-5" />}
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
								id="lastName"
								disabled={isLoading}
							/>
						)}
					</form.Subscribe>
				)}
			/>
			<form.Field
				name="phone_number"
				children={(field: FormField) => (
					<form.Subscribe
						selector={(state: FormSubscriptionState) => ({
							value: state.values[field.name],
							error:
								field.state.meta.errors[0] || apiErrors[field.name],
						})}
					>
						{(state: FormSubscriptionState) => (
							<Input
								label="Phone Number"
								type="tel"
								placeholder="+6012345678"
								icon={<IconPhone className="size-5" />}
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
								id="phoneNumber"
								disabled={isLoading}
							/>
						)}
					</form.Subscribe>
				)}
			/>
		</div>
	)
}

export default RegisterProfile
