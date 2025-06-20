import type { ProjectListResponse } from '@/types/projectManagementTypes.ts'
import { cn } from '@/utils/utils.ts'

const ProjectManagementGridView = ({
	data,
}: {
	data: Array<ProjectListResponse>
}) => (
	<div className="space-y-4 h-screen">
		<h3 className="text-lg font-medium">Projects Grid</h3>
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{data.map((item, i) => (
				<div
					key={i}
					className={
						cn('p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow flex flex-col justify-between', )
					}
				>
					<div></div>
				</div>
			))}
		</div>
	</div>
)

export default ProjectManagementGridView
