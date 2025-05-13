import { createFileRoute } from '@tanstack/react-router'
import StarryNight from '@/components/reusable/StarryNight.tsx'
import RegisterForm from '@/components/auth/register/RegisterForm.tsx'

export const Route = createFileRoute('/register')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="h-[100svh] relative flex items-center justify-center overflow-hidden">
			<StarryNight />
			<div className="absolute inset-0 backdrop-blur-[1px]" />
			<RegisterForm />
		</div>
	)
}
