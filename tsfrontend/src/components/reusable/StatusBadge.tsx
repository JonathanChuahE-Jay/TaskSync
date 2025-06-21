import type { ProjectStatusValue } from '@/types/projectManagementTypes.ts'
import type {StatusColor} from '@/utils/statusUtils.ts';
import { cn } from '@/utils/utils.ts'
import {
	STATUS_COLORS,
	statusCodeToLabelMap,
	statusToColorMap
} from '@/utils/statusUtils.ts'

interface StatusBadgeProps {
	status?: ProjectStatusValue
	color?: StatusColor
	className?: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
	status = 'not_started',
	color,
	className,
}) => {
	const label = statusCodeToLabelMap[status] || status
	const resolvedColor: StatusColor =
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		color !== undefined ? color : statusToColorMap[status] ?? 'gray'

	return (
		<span
			className={cn(
				'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
				STATUS_COLORS[resolvedColor],
				className,
			)}
		>
			{label}
		</span>
	)
}

export default StatusBadge
