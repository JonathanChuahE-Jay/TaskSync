import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/useAuthStore';

export const Route = createFileRoute('/')({
	beforeLoad: () => {
			const { isAuthenticated, user } = useAuthStore.getState();
			if (isAuthenticated && user?.role === 'MEMBER') {
				throw redirect({
					to: '/dashboard'
				})
			}else {
				throw redirect({
					to: '/login'
				})
			}
		},
	component: App,
})

function App() {
	return (
		<div>
			/ Route
		</div>
	)
}
