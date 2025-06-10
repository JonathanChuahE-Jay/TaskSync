import { IconBell, IconSun } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { ZodError } from 'zod'
import Avatar from '@/components/reusable/Avatar.tsx'
import { useUserConfigStore } from '@/store/useUserConfig.ts'
import { Menu } from '@/components/reusable/Menu'
import { createMenuItems } from '@/data/navItemsData'
import { useLogout } from '@/queries/AuthQueries.tsx'
import { useToast } from '@/contexts/ToastContext.tsx'
import { formatZodError } from '@/utils/convertZodToJson.ts'
import { flattenErrorResponse } from '@/utils/flattenErrorResponse.ts'

const TopNav = () => {
	const { toggleTheme } = useUserConfigStore()
	const { toast } = useToast()
	const navigate = useNavigate()
	const logOut = useLogout()

	const onLogout = async () => {
		try {
			await logOut.mutateAsync()
			navigate({ to: '/' })
			toast('Logged out!', 'success')
		} catch (error) {
			console.log(error)
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
		<header className="h-16 pl-20 group-hover:pl-64 transition-all duration-300 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-10 text text-foreground">
			<div className="text-lg font-semibold">User Dashboard</div>
			<div className="flex items-center space-x-6">
				<IconSun
					onClick={toggleTheme}
					className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors"
					size={25}
				/>
				<IconBell
					className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors"
					size={25}
				/>
				<Menu items={menuItems} trigger="click">
					<Avatar
						size="sm"
						src="/profile.jpg"
						alt="User Profile"
						className="cursor-pointer"
					/>
				</Menu>
			</div>
		</header>
	)
}

export default TopNav
