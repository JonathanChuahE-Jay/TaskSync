import { createFileRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/router-core'
import { useAuthStore } from '@/store/useAuthStore.tsx'

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
			dsadsa
		</div>
	)
}
