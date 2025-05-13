import { createFileRoute } from '@tanstack/react-router'
import StarryNight from '@/components/reusable/StarryNight.tsx'
import LoginForm from '@/components/auth/login/LoginForm.tsx'

export const Route = createFileRoute('/login')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="h-[100svh] relative flex items-center justify-center overflow-hidden">
			<StarryNight />
			<div className="absolute inset-0 backdrop-blur-[1px]" />
			<LoginForm />
		</div>
	)
}
