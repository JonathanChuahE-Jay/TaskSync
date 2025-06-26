import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { useState } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore.tsx'
import Sidebar from '@/components/root/Navbar/Sidebar.tsx'
import TopNav from '@/components/root/Navbar/TopNav.tsx'
import { useUserConfigStore } from '@/store/useUserConfig.ts'
import { cn } from '@/utils/utils.ts'
import { useDeviceType } from '@/hooks/useDeviceType'
import FloatDock from '@/components/root/Navbar/Floatdock'

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
		const { isTablet } = useDeviceType()
		const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
		const [sidebarExpanded, setSidebarExpanded] = useState(false)

		return (
			<div
				className={cn(
					'transition-colors duration-700',
					theme === 'dark' ? 'dark' : '',
				)}
			>
				{isAuthenticated ? (
					<div className="flex h-screen ">
						{isTablet ? (
							<FloatDock />
						) : (
								<Sidebar
									isExpanded={sidebarExpanded}
									onExpandedChange={setSidebarExpanded}
								/>
						)}
						<div
							className={cn(
								'flex-1 flex flex-col transition-all duration-300',
								sidebarExpanded && !isTablet
									? 'ml-64'
									: isTablet
										? 'mb-16'
										: 'ml-16',
							)}
						>
							<TopNav />
							<main className="flex-1 overflow-auto min-h-0 scrollbar-hide">
								<div className="p-6">
									<Outlet />
								</div>
							</main>
						</div>
					</div>
				) : (
					<main className="min-h-screen">
						<Outlet />
					</main>
				)}
			</div>
		)
	},
})
