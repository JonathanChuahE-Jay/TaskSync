import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore.tsx'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
    const { init, verify, refresh, isInitialized, resetState } = useAuthStore.getState()

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
            console.error("Auth initialization error:", error)
            resetState()
        }
    }
},
  component: () => (
    <>
      <Outlet />
      {/*<TanStackRouterDevtools />*/}
      {/*<TanstackQueryLayout />*/}
    </>
  ),
})
