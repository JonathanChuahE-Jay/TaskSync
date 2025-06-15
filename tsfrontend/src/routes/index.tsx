import { useAuthStore } from '@/store/useAuthStore';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	beforeLoad: () => {
			const { isAuthenticated, user } = useAuthStore.getState();
			if (isAuthenticated && user?.role === 'MEMBER') {
				throw redirect({
					to: '/dashboard'
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
