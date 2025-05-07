import { motion } from 'framer-motion'

interface StepProps {
	step: number
	label: string
	isActive: boolean
	isCompleted: boolean
	onClick: () => void
	allowStepNavigation: boolean
}

export const Step = ({
	step,
	label,
	isActive,
	isCompleted,
	onClick,
	allowStepNavigation,
}: StepProps) => {
	return (
		<div className="flex flex-col items-center">
			<motion.div
				onClick={allowStepNavigation ? onClick : undefined}
				className={`relative ${allowStepNavigation ? 'cursor-pointer' : 'cursor-default'} rounded-full flex items-center justify-center 
          size-10 font-medium ${
					isActive
						? 'bg-blue-600 text-white'
						: isCompleted
							? 'bg-green-500 text-white'
							: 'bg-gray-200 text-gray-700'
				}`}
				whileHover={allowStepNavigation ? { scale: 1.05 } : {}}
				whileTap={allowStepNavigation ? { scale: 0.95 } : {}}
				transition={{ duration: 0.2 }}
			>
				{isCompleted ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="size-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
				) : (
					step
				)}
			</motion.div>
			<span
				className={`mt-2 text-sm ${
					isActive ? 'text-blue-600 font-medium' : 'text-gray-600'
				}`}
			>
				{label}
			</span>
		</div>
	)
}
