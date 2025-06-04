import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore.tsx'
import Sidebar from '@/components/root/Navbar/Sidebar.tsx'
import TopNav from '@/components/root/Navbar/TopNav.tsx'
import { useUserConfigStore } from '@/store/useUserConfig.ts'
import { cn } from '@/utils/utils.ts'

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		const { init, verify, refresh, isInitialized, resetState } =
			useAuthStore.getState()

		if (!isInitialized) {
			try {
				const isValid = await verify()
				if (isValid) {
					await init()
				} else {
					const refreshed = await refresh()

					if (!refreshed) {
						resetState()
					}
				}
			} catch (error) {
				console.error('Auth initialization error:', error)
				resetState()
			}
		}
	},
	component: () => {
		const { theme } = useUserConfigStore()
		console.log(theme)
		return (
			<div
				className={cn(
					'transition-colors duration-700',
					theme === 'dark' ? 'dark' : '',
				)}
			>
				<Sidebar />
				<TopNav />
				<main className="pt-16 pl-20 group-hover:pl-64 transition-all duration-700 min-h-screen bg-background text-foreground">
					<Outlet />
				</main>
			</div>
		)
	},
})
