import { useState } from 'react'
import { motion } from 'framer-motion'
import type { ErrorResponse } from '@/types/errorResponse.ts'
import { useStepperStore } from '@/store/useStepperStore'
import Stepper from '@/components/reusable/Stepper/Stepper.tsx'
import registerHelpers from '@/components/auth/register/RegisterHelpers.tsx'
import RegisterAlreadyHaveAccountButton from '@/components/auth/register/RegisterAlreadyHaveAccountButton.tsx'
import RegisterCompleted from '@/components/auth/register/stepSections/registerCompleted/RegisterCompleted.tsx'
import RegisterHeader from '@/components/auth/register/RegisterHeader.tsx'
import RegisterOtp from '@/components/auth/register/stepSections/registerOtp/RegisterOtp.tsx'
import RegisterAccount from '@/components/auth/register/stepSections/registerAccount/RegisterAccount.tsx'
import RegisterProfile from '@/components/auth/register/stepSections/registerProfile/RegisterProfile.tsx'
import RegisterComplete from '@/components/auth/register/stepSections/registerComplete/RegisterComplete.tsx'
import AuthModal from '@/components/common/AuthModal.tsx'

const RegisterForm = () => {
	const [otpValue, setOtpValue] = useState('')
	const [apiErrors, setApiErrors] = useState<ErrorResponse>({})
	const [stepValidation, setStepValidation] = useState(Array(5).fill(false))
	const [_, setIsOtpSent] = useState(false)
	const { currentStep } = useStepperStore()

	const { steps, handleNextClick, handleResendOtp, isLoading, form } =
		registerHelpers({
			setApiErrors,
			setStepValidation,
			setIsOtpSent,
			stepValidation,
			otpValue,
		})
	return (
		<AuthModal>
			<motion.div
				initial={{ scale: 0.9 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, duration: 0.4 }}
			>
				<RegisterHeader />
				<Stepper
					showFooterButtons={
						currentStep !== steps.length - 1 &&
						currentStep !== steps.length
					}
					steps={steps}
					allowStepNavigation={false}
					stepValidation={stepValidation}
					onNextClick={handleNextClick}
					onSubmit={form.handleSubmit}
				>
					<RegisterAccount
						apiErrors={apiErrors}
						form={form}
						setApiErrors={setApiErrors}
						isLoading={isLoading}
					/>
					<RegisterProfile
						apiErrors={apiErrors}
						form={form}
						setApiErrors={setApiErrors}
						isLoading={isLoading}
					/>
					<RegisterOtp
						form={form}
						otpValue={otpValue}
						setOtpValue={setOtpValue}
						isLoading={isLoading}
						handleResendOtp={handleResendOtp}
						apiErrors={apiErrors}
					/>
					<RegisterComplete
						apiErrors={apiErrors}
						form={form}
						setApiErrors={setApiErrors}
						isLoading={isLoading}
					/>
					<RegisterCompleted />
				</Stepper>

				<RegisterAlreadyHaveAccountButton />
			</motion.div>
		</AuthModal>
	)
}

export default RegisterForm
