import React from 'react'

type ProgressType = 'circle' | 'line'

interface ProgressBarProps {
	progress: number
	type?: ProgressType
	size?: number // for circle
	width?: number // for line
	height?: number // for line
	strokeWidth?: number // for circle
	color?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
	progress,
	type = 'circle',
	size = 100,
	width = 300,
	height = 12,
	strokeWidth = 10,
	color = '#3b82f6',
}) => {
	const clampedProgress = Math.min(100, Math.max(0, progress))

	if (type === 'circle') {
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

	const progressWidth = (clampedProgress / 100) * width

	return (
		<div className="flex flex-col">
			<svg width={width} height={height}>
				<rect
					x="0"
					y="0"
					width={width}
					height={height}
					rx={height / 2}
					ry={height / 2}
					fill="#e5e7eb"
				/>
				<rect
					x="0"
					y="0"
					width={progressWidth}
					height={height}
					rx={height / 2}
					ry={height / 2}
					fill={color}
				/>
			</svg>
			<div className="text-sm text-gray-700 mt-1">{`Progress: ${clampedProgress}%`}</div>
		</div>
	)
}

export default ProgressBar
