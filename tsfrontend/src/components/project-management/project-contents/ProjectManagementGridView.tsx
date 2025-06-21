import type { ProjectListResponse } from '@/types/projectManagementTypes.ts'
import { cn } from '@/utils/utils.ts'
import StatusBadge from '@/components/reusable/StatusBadge.tsx'

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
							`p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex flex-col justify-between relative`,
						)}
					>
						<div
							className={`absolute top-0 left-0 w-full h-4 rounded-t-lg`}
							style={{ backgroundColor: item.color }}
						/>
						<div className="py-2">
							<div className='flex items-center justify-between'>
								<h1 className="font-bold">{item.title}</h1>
								<StatusBadge status={item.status} />
							</div>
						</div>
					</div>
				)
			})}
		</div>
	</div>
)

export default ProjectManagementGridView
