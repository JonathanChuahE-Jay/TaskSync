const ProjectManagementGridViewStatsCard: React.FC<{
	title: string
	value: string | number
	icon: string
	bgColor: string
	textColor: string
	trendText?: string
	trendUp?: boolean
}> = ({ title, value, icon, bgColor, textColor, trendText, trendUp }) => {
	return (
		<div className="bg-white rounded-lg shadow p-5">
			<div className="flex justify-between items-center">
				<div>
					<p className="text-gray-500 text-sm">{title}</p>
					<h3 className="text-3xl font-bold text-gray-800 mt-1">
						{value}
					</h3>
				</div>
				<div className={`${bgColor} p-3 rounded-full`}>
					<i className={`fas ${icon} ${textColor}`}></i>
				</div>
			</div>
			{trendText && (
				<div
					className={`${trendUp ? 'text-green-500' : 'text-red-500'} text-sm mt-2`}
				>
					<i className={`fas fa-arrow-${trendUp ? 'up' : 'down'}`}></i>{' '}
					{trendText}
				</div>
			)}
		</div>
	)
}

export default ProjectManagementGridViewStatsCard
