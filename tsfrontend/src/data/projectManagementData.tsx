import type {
	ProjectManagementPriorityOptionsType,
	ProjectManagementSortOptionType,
	ProjectManagementTab,
} from '@/types/projectManagementTypes'
import {
	IconAlertCircle,
	IconAlertTriangle,
	IconCalendar,
	IconChartArea,
	IconCircleDashed,
	IconCircleOff,
	IconFlame,
	IconGrid4x4,
	IconList,
	IconTableSpark,
} from '@tabler/icons-react'

export const projectManagementTabs: Array<ProjectManagementTab> = [
	{ id: 'grid', label: 'Grid', icon: <IconGrid4x4 /> },
	{ id: 'list', label: 'List', icon: <IconList /> },
	{ id: 'calendar', label: 'Calendar', icon: <IconCalendar /> },
	{ id: 'chart', label: 'Chart', icon: <IconChartArea /> },
	{ id: 'tasks', label: 'Tasks', icon: <IconTableSpark /> },
]

export const projectManagementsortOptions: Array<ProjectManagementSortOptionType> =
	['Recent updated', 'Oldest first', 'Alphabetical', 'Priority']

export const projectManagementPriorityOptions: Array<ProjectManagementPriorityOptionsType> = [
	{
		prefix: <IconCircleOff className="size-5 text-gray-600" />,
		value: 'none',
		label: 'None',
		description: 'No priority assigned',
	},
	{
		prefix: <IconCircleDashed className="size-5 text-blue-600" />,
		value: 'low',
		label: 'Low',
		description: 'Can be addressed later',
	},
	{
		prefix: <IconAlertCircle className="size-5 text-yellow-600" />,
		value: 'medium',
		label: 'Medium',
		description: 'Should be addressed soon',
	},
	{
		prefix: <IconAlertTriangle className="size-5 text-orange-600" />,
		value: 'high',
		label: 'High',
		description: 'Important issue to fix',
	},
	{
		prefix: <IconFlame className="size-5 text-red-600" />,
		value: 'critical',
		label: 'Critical',
		description: 'Requires immediate attention',
	},
]


