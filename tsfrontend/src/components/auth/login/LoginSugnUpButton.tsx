import { Link } from '@tanstack/react-router'

const LoginSignUpButton = () => {
	return (
		<div className="mt-6 text-center text-sm">
			<span className="text-slate-600">Don't have an account?</span>{' '}
			<Link
				to="/register"
				className="text-blue-600 font-medium hover:text-blue-800 hover:underline transition-colors"
			>
				Sign up now
			</Link>
		</div>
	)
}

export default LoginSignUpButton
