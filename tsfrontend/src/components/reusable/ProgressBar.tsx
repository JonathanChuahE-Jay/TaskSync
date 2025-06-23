const ProgressBar: React.FC<{
	progress: number
	dueDate?: string | null
	type?: 'circle' | 'line'
	width?: number
	fullWidth?: boolean
	height?: number
	strokeWidth?: number
	color?: string
}> = ({
	progress,
	dueDate,
	type = 'line',
	width,
	// fullWidth = true,
	// height = 10,
	strokeWidth = 10,
	color = '#3b82f6',
}) => {
	const clampedProgress = Math.min(100, Math.max(0, progress))

	if (type === 'circle') {
		const size = width || 100
		const radius = (size - strokeWidth) / 2
		const circumference = 2 * Math.PI * radius
		const offset = circumference - (clampedProgress / 100) * circumference

		return (
			<div className="flex flex-col items-center">
				<svg width={size} height={size} className="block">
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke="#e5e7eb"
						strokeWidth={strokeWidth}
						fill="none"
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={color}
						strokeWidth={strokeWidth}
						fill="none"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						strokeLinecap="round"
						transform={`rotate(-90 ${size / 2} ${size / 2})`}
					/>
					<text
						x="50%"
						y="50%"
						dominantBaseline="middle"
						textAnchor="middle"
						fontSize={size * 0.2}
						fill="#111827"
					>
						{clampedProgress}%
					</text>
				</svg>
				<div className="text-sm text-gray-700 mt-1">Progress</div>
			</div>
		)
	}

	// const barWidth = fullWidth ? '100%' : `${width}px`
	const progressWidth = `${clampedProgress}%`

	return (
		<div className="flex flex-col w-full">
			<div className="w-full bg-gray-200 rounded-full h-2.5">
				<div
					className="h-2.5 rounded-full"
					style={{ width: progressWidth, backgroundColor: color }}
				/>
			</div>
			<div className="flex justify-between text-xs text-gray-500 mt-1">
				<span>{clampedProgress}% complete</span>
				<span>{dueDate ? dueDate : 'No due date'}</span>
			</div>
		</div>
	)
}

export default ProgressBar
