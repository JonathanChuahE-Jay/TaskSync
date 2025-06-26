import type { ProjectTeamMemberType } from '@/types/projectManagementTypes.ts'

const ProjectManagementGridViewProjectMembers: React.FC<{
		members: Array<ProjectTeamMemberType>
		maxDisplay?: number
	}> = ({ members, maxDisplay = 4 }) => {
		const displayMembers = members.slice(0, maxDisplay)
		const remaining = members.length - maxDisplay

		return (
			<div className="flex -space-x-2">
				{displayMembers.map((member, index) => (
					<img
						key={index}
						className="w-7 h-7 rounded-full border-2 border-white"
						src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'women' : 'men'}/${20 + index}.jpg`}
						alt={`${member.user.first_name} ${member.user.last_name}`}
					/>
				))}

				{remaining > 0 && (
					<div className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
						+{remaining}
					</div>
				)}
			</div>
		)
	}
export default ProjectManagementGridViewProjectMembers