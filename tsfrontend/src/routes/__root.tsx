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
		const { init } = useAuthStore.getState()
		await init()
	},
	component: () => {
		const { theme } = useUserConfigStore()
		const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
		return (
			<div
				className={cn(
					'transition-colors duration-700',
					theme === 'dark' ? 'dark' : '',
				)}
			>
				{isAuthenticated && (
					<>
						<Sidebar />
						<TopNav />
					</>
				)}
				<main
					className={cn(
						'group-hover:pl-64 transition-all duration-700 min-h-screen bg-background text-foreground',
						isAuthenticated && 'pt-16 pl-20 ',
					)}
				>
					<Outlet />
				</main>
			</div>
		)
	},
})
