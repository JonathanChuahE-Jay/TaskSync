import { createFileRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/router-core'
import StarryNight from '@/components/reusable/StarryNight.tsx'
import LoginForm from '@/components/auth/login/LoginForm.tsx'
import { useAuthStore } from '@/store/useAuthStore.tsx'

export const Route = createFileRoute('/login')({
	beforeLoad: () => {
		const { isAuthenticated, user } = useAuthStore.getState();
		if (isAuthenticated && user?.role === 'MEMBER') {
			throw redirect({
				to: '/dashboard'
			})
		}
	},
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
