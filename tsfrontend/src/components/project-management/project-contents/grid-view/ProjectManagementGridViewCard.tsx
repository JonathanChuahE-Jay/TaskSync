import type {
	ProjectListResponse,
	ProjectStatus,
} from '@/types/projectManagementTypes.ts'
import StatusBadge from '@/components/reusable/StatusBadge.tsx'
import ProgressBar from '@/components/reusable/ProgressBar.tsx'
import ProjectManagementGridViewProjectMmembers
	from '@/components/project-management/project-contents/grid-view/ProjectManagementGridViewProjectMmembers.tsx'

const ProjectManagementGridViewCard: React.FC<{
	project: ProjectListResponse
}> = ({ project }) => {
	const colors: Record<ProjectStatus, string> = {
		active: 'bg-green-500',
		at_risk: 'bg-yellow-500',
		completed: 'bg-blue-500',
		planning: 'bg-purple-500',
		on_hold: 'bg-gray-500',
		critical: 'bg-red-500',
		not_started: 'bg-indigo-500',
		in_progress: 'bg-green-500',
	}

	return (
		<div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow">
			<div className={`h-3 ${colors[project.status]}`}></div>

			<div className="p-5">
				<div className="flex justify-between items-start">
					<h3 className="font-bold text-lg text-gray-800">
						{project.title}
					</h3>
					<StatusBadge status={project.status} />
				</div>
				<p className="text-gray-600 text-sm mt-2 line-clamp-3">
					{project.description}
				</p>
				<div className="mt-4">
					<ProgressBar
						progress={project.progress_percentage}
						dueDate={
							project.due_date
								? new Date(project.due_date).toLocaleDateString()
								: null
						}
						color={project.color || '#3b82f6'}
					/>
				</div>
				<div className="mt-4 flex justify-between items-center">
					<ProjectManagementGridViewProjectMmembers members={project.project_teams} />
					<div className="text-sm text-gray-500">
						<i className="fas fa-tasks mr-1"></i>{' '}
						{Math.round(project.progress_percentage / 5)}/20
					</div>
				</div>
			</div>
		</div>
	)
}
export default ProjectManagementGridViewCard
