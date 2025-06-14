import { createFileRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/router-core'
import { useAuthStore } from '@/store/useAuthStore.tsx'

export const Route = createFileRoute('/(members)')({
	beforeLoad: () => {
		const { isAuthenticated, user } = useAuthStore.getState()

		if (!isAuthenticated) {
			throw redirect({
				to: '/',
			})
		}
	},
})
