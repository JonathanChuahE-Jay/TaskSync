import {
	IconLayoutDashboard,
	IconUsers,
	IconSettings,
	IconBriefcase,
	IconCalendar,
	IconChartBar,
	IconUser,
	IconTag,
	IconClock,
	IconLogout,
} from '@tabler/icons-react'

export const navGroups = [
	{
		title: 'MAIN',
		items: [
			{
				name: 'Dashboard',
				to: '/dashboard',
				icon: <IconLayoutDashboard size={24} />,
			},
			{ name: 'My Tasks', to: '/my-tasks', icon: <IconUsers size={24} /> },
			{
				name: 'Calendar',
				to: '/calendar',
				icon: <IconCalendar size={24} />,
			},
			{
				name: 'Analytics',
				to: '/analytics',
				icon: <IconChartBar size={24} />,
			},
		],
	},
	{
		title: 'WORKSPACES',
		items: [
			{
				name: 'Project Management',
				to: '/project-management',
				icon: <IconBriefcase size={24} />,
			},
			{ name: 'Team', to: '/team', icon: <IconUser size={24} /> },
			{ name: 'Sprints', to: '/sprints', icon: <IconChartBar size={24} /> },
		],
	},
	{
		title: 'TOOLS',
		items: [
			{ name: 'Templates', to: '/templates', icon: <IconUsers size={24} /> },
			{ name: 'Tags', to: '/tags', icon: <IconTag size={24} /> },
			{
				name: 'Time Tracking',
				to: '/time-tracking',
				icon: <IconClock size={24} />,
			},
		],
	},
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
