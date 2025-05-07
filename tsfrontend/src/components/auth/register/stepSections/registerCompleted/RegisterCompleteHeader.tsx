import { motion } from 'framer-motion'

const RegisterCompleteHeader = () => {
	return (
		<div className="py-4 text-center">
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="mb-4 flex justify-center"
			>
				<div className="bg-green-100 text-green-600 rounded-full p-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-12 w-12"
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
				</div>
			</motion.div>

			<h3 className="text-xl font-medium text-gray-800 mb-2">
				Verification Completed!
			</h3>
			<p className="text-gray-600">
				Your account is ready to be created. Please review the information
				before submitting.
			</p>
		</div>
	)
}

export default RegisterCompleteHeader
