import StarryNight from '@/components/reusable/StarryNight.tsx'
import LoginForm from '@/components/auth/login/LoginForm.tsx'

const Login = () => {
	return (
		<div className="h-[100svh] relative flex items-center justify-center overflow-hidden">
			<StarryNight />
			<div className="absolute inset-0 backdrop-blur-[1px]" />
			<LoginForm />
		</div>
	)
}

export default Login
