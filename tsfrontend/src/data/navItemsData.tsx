import {
	IconLayoutDashboard,
	IconLogout,
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
	{ name: 'Project Management', to: '/project-management', icon: <IconUsers size={24} /> },
	{ name: 'Reports', to: '/reports', icon: <IconReportAnalytics size={24} /> },
	{ name: 'Settings', to: '/settings', icon: <IconSettings size={24} /> },
]

export const createMenuItems = ({ onLogout }: { onLogout: () => void }) => [
	{
		label: 'Settings',
		onClick: () => console.log('Go to Settings'),
		icon: <IconSettings size={16} />,
	},
	{
		label: 'Logout',
		onClick: onLogout,
		icon: <IconLogout size={16} />,
	},
]
