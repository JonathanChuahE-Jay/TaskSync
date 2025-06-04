import { Link } from '@tanstack/react-router'

const LoginSignUpButton = () => {
	return (
		<div className="mt-6 text-center text-sm">
			<span className="text-slate-600">Don't have an account?</span>{' '}
			<Link
				to="/register"
				className="link font-medium  hover:underline transition-colors"
			>
				Sign up now
			</Link>
		</div>
	)
}

export default LoginSignUpButton
