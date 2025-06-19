import { createFileRoute } from '@tanstack/react-router'
import StarryNight from '@/components/reusable/StarryNight.tsx'
import RegisterForm from '@/components/auth/register/RegisterForm.tsx'

export const Route = createFileRoute('/(auth)/register')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex min-h-[100dvh] items-center justify-center bg-red-200">
			<StarryNight />
			{/* <div className="absolute inset-0 backdrop-blur-[1px]" /> */}
			<RegisterForm />
		</div>
	)
}
