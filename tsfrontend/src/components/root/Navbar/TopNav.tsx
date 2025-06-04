import { IconBell, IconSun } from '@tabler/icons-react'
import Avatar from '@/components/reusable/Avatar.tsx'
import { useUserConfigStore } from '@/store/useUserConfig.ts'

const TopNav = () => {
	const { toggleTheme } = useUserConfigStore()
	return (
		<header className="h-16 pl-20 group-hover:pl-64 transition-all duration-300 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-10 text  text-foreground">
			<div className="text-lg font-semibold">Admin Dashboard</div>
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
				<Avatar size="sm" src="/profile.jpg" alt="User Profile" className='cursor-pointer'/>
			</div>
		</header>
	)
}

export default TopNav
