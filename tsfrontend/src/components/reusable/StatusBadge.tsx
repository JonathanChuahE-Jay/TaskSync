import { ProjectStatus } from '@/types/projectManagementTypes.ts'

const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => {
	const statusConfig: Record<
		ProjectStatus,
		{ bg: string; text: string; label: string }
	> = {
		[ProjectStatus.NOT_STARTED]: {
			bg: 'bg-indigo-100',
			text: 'text-indigo-700',
			label: 'Not Started',
		},
		[ProjectStatus.IN_PROGRESS]: {
			bg: 'bg-green-100',
			text: 'text-green-700',
			label: 'In Progress',
		},
		[ProjectStatus.COMPLETED]: {
			bg: 'bg-blue-100',
			text: 'text-blue-700',
			label: 'Completed',
		},
		[ProjectStatus.PLANNING]: {
			bg: 'bg-purple-100',
			text: 'text-purple-700',
			label: 'Planning',
		},
		[ProjectStatus.AT_RISK]: {
			bg: 'bg-yellow-100',
			text: 'text-yellow-700',
			label: 'At Risk',
		},
		[ProjectStatus.CRITICAL]: {
			bg: 'bg-red-100',
			text: 'text-red-700',
			label: 'Critical',
		},
		[ProjectStatus.ON_HOLD]: {
			bg: 'bg-gray-100',
			text: 'text-gray-700',
			label: 'On Hold',
		},
	}
	const config = statusConfig[status]

	return (
		<span
			className={`${config.bg} ${config.text} text-xs font-semibold px-2.5 py-0.5 rounded-full`}
		>
			{config.label}
		</span>
	)
}

export default StatusBadge
