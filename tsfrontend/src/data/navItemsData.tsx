import {
	IconLayoutDashboard,
	IconReportAnalytics,
	IconSettings,
	IconUsers,
} from '@tabler/icons-react'

export const navItems = [
	{
		name: 'Dashboard',
		to: '/dashboard',
		icon: <IconLayoutDashboard size={24} />,
	},
	{ name: 'Users', to: '/users', icon: <IconUsers size={24} /> },
	{ name: 'Reports', to: '/reports', icon: <IconReportAnalytics size={24} /> },
	{ name: 'Settings', to: '/settings', icon: <IconSettings size={24} /> },
]
