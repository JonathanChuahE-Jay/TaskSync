import { motion } from 'framer-motion'
import { useDefaultFormContext } from './DefaultAppForm.tsx'
import Loader from '@/components/reusable/Loaders.tsx'

export function SubmitButton({
	label,
	loadingLabel,
	dynamicText,
	sideBySide,
	variant,
	isLoading
}: {
	isLoading?: boolean
	label: string
	loadingLabel: string
	dynamicText?: boolean
	sideBySide?: boolean
	variant?: "pulse" | "spin" | "dots" | "bars" | "wave" | "bounce" | "spiral" | undefined
}) {
	const form = useDefaultFormContext()
	return (
		<form.Subscribe>
			{({ isSubmitting }) => (
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={form.handleSubmit}
					className="w-full py-3 px-4 mt-4 bg-gradient-to-r 
						 from-blue-600 to-indigo-600
						 hover:from-blue-700 hover:to-indigo-700
						 dark:from-sky-600 dark:to-indigo-700
						 dark:hover:from-sky-700 dark:hover:to-indigo-800
						 text-white font-medium rounded-xl
						 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30
						 dark:shadow-blue-900/30 dark:hover:shadow-blue-900/40
						 disabled:opacity-70 disabled:cursor-not-allowed
						 transition duration-200 flex justify-center items-center"
					disabled={isSubmitting}
					type="button"
				>
					{isSubmitting || isLoading ? (
						<Loader
							dynamicText={dynamicText}
							sideBySide={sideBySide}
							label={loadingLabel}
							variant={variant}
						/>
					) : (
						label
					)}
				</motion.button>
			)}
		</form.Subscribe>
	)
}
