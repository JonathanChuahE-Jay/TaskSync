import { motion } from 'framer-motion'
import type {
	CommonStepSection,
	FormField,
	FormSubscriptionState,
} from '@/types/login.ts'
import RegisterCompleteHeader from '@/components/auth/register/stepSections/registerCompleted/RegisterCompleteHeader.tsx'
import Input from '@/components/reusable/Input.tsx'
import { cn } from '@/utils/utils.ts'
import Loader from '@/components/reusable/Loaders.tsx'

const RegisterComplete = ({
	apiErrors,
	form,
	setApiErrors,
	isLoading,
}: CommonStepSection) => {
	return (
		<div className="space-y-5">
			<RegisterCompleteHeader />

			<div className="bg-blue-50 p-4 rounded-lg space-y-3">
				<div className="flex justify-between">
					<span className="text-gray-500">Email:</span>
					<span className="font-medium">
						{form.getFieldValue('email')}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-500">Username:</span>
					<span className="font-medium">
						{form.getFieldValue('username')}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-500">Full Name:</span>
					<span className="font-medium">
						{form.getFieldValue('first_name')}{' '}
						{form.getFieldValue('last_name')}
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-gray-500">Phone:</span>
					<span className="font-medium">
						{form.getFieldValue('phone_number').length > 0 ? form.getFieldValue('phone_number') : 'Not Provided'}
					</span>
				</div>
			</div>

			<div className="pt-1">
				<form.Field
					name="agreeToTerms"
					children={(field: FormField) => (
						<form.Subscribe
							selector={(state: FormSubscriptionState) => ({
								value: state.values[field.name],
								error:
									field.state.meta.errors[0] || apiErrors[field.name],
							})}
						>
							{(state: FormSubscriptionState) => (
								<>
									<Input
										label="I agree to the Terms and Privacy Policy"
										type="checkbox"
										placeholder=""
										icon={null}
										value={state.value}
										onChange={(e) => {
											field.handleChange(e.target.checked)
											if (apiErrors[field.name]) {
												setApiErrors((prev) => ({
													...prev,
													[field.name]: '',
												}))
											}
										}}
										error={state.error}
										id="agreeToTerms"
									/>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={form.handleSubmit}
										disabled={!form.getFieldValue('agreeToTerms')}
										className={cn(
											`w-full py-3 px-4 mt-4 text-white font-medium rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition duration-200 flex justify-center items-center`,
											form.getFieldValue('agreeToTerms')
												? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
												: 'bg-gray-400 cursor-not-allowed',
										)}
										type="button"
									>
										{isLoading ? (
											<Loader
												dynamicText={true}
												sideBySide={true}
												label="Creating Account"
												variant="bars"
											/>
										) : (
											'Create Account'
										)}
									</motion.button>
								</>
							)}
						</form.Subscribe>
					)}
				/>
			</div>
		</div>
	)
}

export default RegisterComplete
