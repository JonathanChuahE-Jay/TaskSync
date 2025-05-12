import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useStepperStore } from '@/store/useStepperStore'
import { Step } from '@/components/reusable/Stepper/Step.tsx'
import { cn } from '@/utils/utils.ts'
import { useClickEnter } from '@/hooks/useClickEnter.tsx'

interface StepperProps {
	steps: Array<{ label: string }>
	children: React.ReactNode
	allowStepNavigation?: boolean
	stepValidation?: Array<boolean>
	onNextClick?: (currentStep: number) => Promise<boolean> | boolean
	onSubmit?: () => void
	showFooterButtons?: boolean
}

const Stepper = ({
	steps,
	children,
	allowStepNavigation = false,
	stepValidation = [],
	onNextClick,
	onSubmit,
	showFooterButtons = true,
}: StepperProps) => {
	const {
		currentStep,
		totalSteps,
		goToStep,
		nextStep,
		prevStep,
		setTotalSteps,
	} = useStepperStore()

	useEffect(() => {
		setTotalSteps(steps.length)
	}, [steps.length, setTotalSteps])

	const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

	const isCurrentStepValid = stepValidation[currentStep - 1] === true

	const handleNextClick = async () => {
		if (currentStep === totalSteps) {
			onSubmit && onSubmit()
			return
		}

		if (onNextClick) {
			const canProceed = await onNextClick(currentStep)
			if (canProceed) {
				nextStep()
			}
		} else {
			if (isCurrentStepValid) {
				nextStep()
			}
		}
	}

	useClickEnter(handleNextClick)

	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-8 relative">
				<div className="absolute h-1 bg-gray-200 top-5 left-[15px] right-[15px] z-0" />
				<motion.div
					className="absolute h-1 bg-blue-600 top-5 left-[12px] z-0"
					initial={{ width: 0 }}
					animate={{ width: `calc(${progress}% - 24px)` }}
					transition={{ duration: 0.3 }}
				/>

				{steps.map((step, index) => (
					<Step
						key={index}
						step={index + 1}
						label={step.label}
						isActive={currentStep === index + 1}
						isCompleted={currentStep > index + 1}
						onClick={() => goToStep(index + 1)}
						allowStepNavigation={
							allowStepNavigation &&
							(stepValidation[index] ||
								index + 1 < currentStep ||
								index + 1 === currentStep)
						}
					/>
				))}
			</div>

			<div className="mt-8">
				{Array.isArray(children) ? children[currentStep - 1] : children}
			</div>

			{showFooterButtons && (
				<div className="flex justify-between mt-8">
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={cn(
							`px-6 py-2 rounded-lg w-[40%]`,
							currentStep === 1
								? 'bg-gray-200 text-gray-400 cursor-not-allowed'
								: 'bg-gray-200 text-gray-800',
						)}
						onClick={prevStep}
						disabled={currentStep === 1}
					>
						Previous
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className={
							cn(`px-6 py-2 rounded-lg w-[40%]`,
							currentStep === totalSteps
								? 'bg-green-600 text-white'
								: 'bg-blue-600 text-white')
						}
						onClick={handleNextClick}
					>
						{currentStep === totalSteps ? 'Submit' : 'Next'}
					</motion.button>
				</div>
			)}
		</div>
	)
}

export default Stepper
