import type { ProjectListResponse } from '@/types/projectManagementTypes.ts'
import { cn } from '@/utils/utils.ts'
import StatusBadge from '@/components/reusable/StatusBadge.tsx'
import ProgressBar from '@/components/reusable/ProgressBar.tsx'

const ProjectManagementGridView = ({
	data,
}: {
	data: Array<ProjectListResponse>
}) => (
	<div className="space-y-4 h-screen">
		<h3 className="text-lg font-medium">Projects Grid</h3>
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{data.map((item, i) => {
				return (
					<div
						key={i}
						className={cn(
							`py-6 px-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex flex-col justify-between relative`,
						)}
					>
						<div
							className={`absolute top-0 left-0 w-full h-4 rounded-t-lg`}
							style={{ backgroundColor: item.color }}
						/>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<h1 className="font-bold line-clamp-1 ">
									{item.title}
								</h1>
								<StatusBadge status={item.status} />
							</div>
							<p className="text-gray-500 text-sm line-clamp-3 ">
								{item.description}
							</p>
							<ProgressBar
								progress={55}
								type="line"
								width={300}
								height={14}
								color="#3b82f6"
							/>
						</div>
					</div>
				)
			})}
		</div>
	</div>
)

export default ProjectManagementGridView
