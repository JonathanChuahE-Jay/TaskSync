import { ProjectStatusType } from '@/types/projectManagementTypes.ts'

const StatusBadge: React.FC<{ status: ProjectStatusType }> = ({ status }) => {
	const statusConfig: Record<
		ProjectStatusType,
		{ bg: string; text: string; label: string }
	> = {
		[ProjectStatusType.NOT_STARTED]: {
			bg: 'bg-indigo-100',
			text: 'text-indigo-700',
			label: 'Not Started',
		},
		[ProjectStatusType.IN_PROGRESS]: {
			bg: 'bg-green-100',
			text: 'text-green-700',
			label: 'In Progress',
		},
		[ProjectStatusType.COMPLETED]: {
			bg: 'bg-blue-100',
			text: 'text-blue-700',
			label: 'Completed',
		},
		[ProjectStatusType.PLANNING]: {
			bg: 'bg-purple-100',
			text: 'text-purple-700',
			label: 'Planning',
		},
		[ProjectStatusType.AT_RISK]: {
			bg: 'bg-yellow-100',
			text: 'text-yellow-700',
			label: 'At Risk',
		},
		[ProjectStatusType.CRITICAL]: {
			bg: 'bg-red-100',
			text: 'text-red-700',
			label: 'Critical',
		},
		[ProjectStatusType.ON_HOLD]: {
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
