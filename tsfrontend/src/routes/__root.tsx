import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore.tsx'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		const {init, isInitialized} = useAuthStore.getState()
		if (!isInitialized) await init();
	},
  component: () => (
    <>
      <Outlet />
      {/*<TanStackRouterDevtools />*/}
      {/*<TanstackQueryLayout />*/}
    </>
  ),
})
