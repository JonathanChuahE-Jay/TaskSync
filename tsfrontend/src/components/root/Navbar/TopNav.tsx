import { IconBell, IconSun } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { ZodError } from 'zod'
import Avatar from '@/components/reusable/Avatar.tsx'
import { useUserConfigStore } from '@/store/useUserConfig.ts'
import { Menu } from '@/components/reusable/Menu'
import { createMenuItems } from '@/data/navItemsData'
import { useLogout } from '@/queries/AuthQueries.ts'
import { useToast } from '@/contexts/ToastContext.tsx'
import { formatZodError } from '@/utils/convertZodToJson.ts'
import { flattenErrorResponse } from '@/utils/flattenErrorResponse.ts'
import { useAuthStore } from '@/store/useAuthStore.tsx'

const TopNav = () => {
	const { toggleTheme } = useUserConfigStore()
	const { resetState } = useAuthStore()
	const { toast } = useToast()
	const navigate = useNavigate()
	const logOut = useLogout()

	const onLogout = async () => {
		try {
			await logOut.mutateAsync()
			resetState()
			navigate({ to: '/login' })
			toast('Logged out!', 'success')
		} catch (error) {
			if (error instanceof ZodError) {
				toast(flattenErrorResponse(formatZodError(error)), 'error', {
					direction: 'top-center',
				})
			} else {
				const err = error as Error
				toast(err.message || 'Login failed', 'error', {
					direction: 'top-center',
				})
			}
		}
	}

	const menuItems = createMenuItems({ onLogout })

	return (
		<header className="h-16 flex items-center justify-between transition-all duration-700 px-6 bg-background/95 backdrop-blur-sm  sticky top-0 z-20">
			<div className="text-lg font-semibold text-foreground">
				User Dashboard
			</div>

			<div className="flex items-center space-x-4">
				<button
					onClick={toggleTheme}
					className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
					title="Toggle theme"
				>
					<IconSun size={20} />
				</button>

				<button
					className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative"
					title="Notifications"
				>
					<IconBell size={20} />
					<span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
				</button>

				<Menu items={menuItems} trigger="click">
					<Avatar
						size="sm"
						src="/profile.jpg"
						alt="User Profile"
						className="cursor-pointer transition-all"
					/>
				</Menu>
			</div>
		</header>
	)
}

export default TopNav
