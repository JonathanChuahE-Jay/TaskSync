import { Link } from '@tanstack/react-router'

const ForgotPasswordLink = () => {
	return (
		<Link
			to="/"
			className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
		>
			Forgot password?
		</Link>
	)
}

export default ForgotPasswordLink
