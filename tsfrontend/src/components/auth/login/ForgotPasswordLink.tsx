import { Link } from '@tanstack/react-router'

const ForgotPasswordLink = () => {
	return (
		<Link
			to="/"
			className="text-sm font-medium link transition-colors"
		>
			Forgot password?
		</Link>
	)
}

export default ForgotPasswordLink
