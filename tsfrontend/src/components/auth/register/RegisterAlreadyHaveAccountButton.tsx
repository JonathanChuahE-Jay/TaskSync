import { Link } from '@tanstack/react-router'
import { useStepperStore } from '@/store/useStepperStore.tsx'

const RegisterAlreadyHaveAccountButton = () => {
	const { currentStep, totalSteps } = useStepperStore()

	if (currentStep === totalSteps) return null
	return (
		<div className="mt-6 text-center">
			<p className="text-gray-600">
				Already have an account?{' '}
				<Link
					to="/login"
					className="text-blue-600 hover:text-blue-800 font-medium"
				>
					Sign In
				</Link>
			</p>
		</div>
	)
}

export default RegisterAlreadyHaveAccountButton
