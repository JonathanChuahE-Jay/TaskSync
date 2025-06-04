import { Link, useRouterState } from '@tanstack/react-router'
import {
	IconLayoutDashboard,
	IconReportAnalytics,
	IconSettings,
	IconUsers,
} from '@tabler/icons-react'
import { cn } from '@/utils/utils.ts'

const navItems = [
	{
		name: 'Dashboard',
		to: '/dashboard',
		icon: <IconLayoutDashboard size={24} />,
	},
	{ name: 'Users', to: '/users', icon: <IconUsers size={24} /> },
	{ name: 'Reports', to: '/reports', icon: <IconReportAnalytics size={24} /> },
	{ name: 'Settings', to: '/settings', icon: <IconSettings size={24} /> },
]

const Sidebar = () => {
	const { location } = useRouterState()
	return (
		<aside className="group w-16 hover:w-64 transition-all duration-300 bg-sidebar text-sidebar-foreground shadow-md h-screen flex flex-col fixed top-0 left-0 overflow-hidden z-20">
			<div className="h-16 flex items-center justify-center group-hover:justify-start px-4">
				<img src="/logo.png" alt="Logo" className="h-10" />
				<span className="ml-4 text-lg font-bold hidden group-hover:inline">
					MyCompany
				</span>
			</div>
			<nav className="flex-1 flex flex-col px-2 py-4 space-y-2">
				{navItems.map((item) => {
					const isActive = location.pathname.startsWith(item.to)
					return (
						<Link
							key={item.to}
							to={item.to}
							className={cn(
								`flex items-center space-x-4 px-3 py-2 rounded-md text-sm font-medium transition-colors`,
								isActive
									? 'bg-sidebar-primary text-sidebar-primary-foreground'
									: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
							)}
						>
							<span className="text-xl">{item.icon}</span>
							<span className="hidden group-hover:inline">
								{item.name}
							</span>
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}

export default Sidebar
