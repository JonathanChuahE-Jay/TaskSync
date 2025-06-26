import type {
	ProjectListResponseType,
	ProjectStatusType,
} from '@/types/projectManagementTypes.ts'
import StatusBadge from '@/components/reusable/StatusBadge.tsx'
import ProgressBar from '@/components/reusable/ProgressBar.tsx'
import ProjectManagementGridViewProjectMembers from '@/components/project-management/project-contents/grid-view/ProjectManagementGridViewProjectMmembers.tsx'

interface ProjectManagementGridViewCardProps {
	project: ProjectListResponseType
	onDragStart: (e: React.DragEvent, project: ProjectListResponseType) => void
	onDragEnd: () => void
	isDragging: boolean
	position: number
}

const ProjectManagementGridViewCard: React.FC<
	ProjectManagementGridViewCardProps
> = ({ project, onDragStart, onDragEnd, isDragging, position }) => {
	const colors: Record<ProjectStatusType, string> = {
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
		<div
			className={`bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-all cursor-move h-full flex flex-col ${
				isDragging ? 'opacity-50' : ''
			}`}
			draggable
			onDragStart={(e) => onDragStart(e, project)}
			onDragEnd={onDragEnd}
		>
			<div className={`h-3 ${colors[project.status]}`}></div>
			<div className="p-5 flex-grow flex flex-col">
				<div className="flex justify-between items-start mb-1">
					<h3 className="font-bold text-lg w-2/3 text-gray-800">
						{project.title}
					</h3>
					<StatusBadge status={project.status} />
				</div>
				{/*<div className="text-xs text-gray-400 mb-2">*/}
				{/*	Position: {position}*/}
				{/*</div>*/}
				<p className="text-gray-600 text-sm mt-2 line-clamp-3 flex-grow">
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
					<ProjectManagementGridViewProjectMembers
						members={project.project_teams}
					/>
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
