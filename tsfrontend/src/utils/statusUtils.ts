import type { ProjectStatusValue } from '@/types/projectManagementTypes.ts'

export const STATUS_COLORS = {
	green: 'bg-green-100 text-green-800',
	red: 'bg-red-100 text-red-800',
	yellow: 'bg-yellow-100 text-yellow-800',
	blue: 'bg-blue-100 text-blue-800',
	gray: 'bg-gray-100 text-gray-800',
} as const

export type StatusColor = keyof typeof STATUS_COLORS

export const statusCodeToLabelMap: Record<ProjectStatusValue, string> = {
	not_started: 'Not Started',
	in_progress: 'In Progress',
	completed: 'Completed',
	planning: 'Planning',
	at_risk: 'At Risk',
	critical: 'Critical',
	on_hold: 'On Hold',
}

export const statusToColorMap: Record<ProjectStatusValue, StatusColor> = {
	not_started: 'gray',
	in_progress: 'yellow',
	completed: 'green',
	planning: 'blue',
	at_risk: 'yellow',
	critical: 'red',
	on_hold: 'blue',
}
