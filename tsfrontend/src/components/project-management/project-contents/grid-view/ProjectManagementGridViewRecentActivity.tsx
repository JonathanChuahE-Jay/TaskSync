const ProjectManagementGridViewRecentActivity = () => {
	const ActivityItem: React.FC<{
		imgSrc: string
		name: string
		action: string
		target: string
		project: string
		timestamp: string
	}> = ({ imgSrc, name, action, target, project, timestamp }) => {
		return (
			<div className="flex">
				<div className="flex-shrink-0 mr-3">
					<img className="h-10 w-10 rounded-full" src={imgSrc} alt="" />
				</div>
				<div className="flex-grow">
					<p className="text-sm text-gray-700">
						<span className="font-medium">{name}</span> {action}{' '}
						<span className="font-medium">{target}</span> in{' '}
						<span className="font-medium text-indigo-600">{project}</span>
					</p>
					<span className="text-xs text-gray-500">{timestamp}</span>
				</div>
			</div>
		)
	}
	return (
		<div className="bg-white shadow rounded-lg p-5 mb-5">
			<h3 className="text-lg font-medium text-gray-800 mb-4">
				Recent Activity
			</h3>
			<div className="space-y-4">
				<ActivityItem
					imgSrc="https://randomuser.me/api/portraits/women/44.jpg"
					name="Sarah Johnson"
					action="completed task"
					target="Design homepage mockup"
					project="Website Redesign"
					timestamp="Today, 11:32 AM"
				/>
				<ActivityItem
					imgSrc="https://randomuser.me/api/portraits/men/45.jpg"
					name="Michael Rodriguez"
					action="created a new project"
					target=""
					project="Q3 Sales Strategy"
					timestamp="Yesterday, 3:45 PM"
				/>
				<ActivityItem
					imgSrc="https://randomuser.me/api/portraits/men/22.jpg"
					name="David Kim"
					action="added 3 new team members to"
					target=""
					project="Product Launch: Echo Device"
					timestamp="Yesterday, 1:15 PM"
				/>
				<ActivityItem
					imgSrc="https://randomuser.me/api/portraits/women/32.jpg"
					name="Emily Chen"
					action="commented on task"
					target="Finalize user testing plan"
					project="Mobile App Development"
					timestamp="May 15, 4:30 PM"
				/>
			</div>
			<div className="mt-5">
				<a
					href="#"
					className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
				>
					View all activity
				</a>
			</div>
		</div>
	)
}

export default ProjectManagementGridViewRecentActivity
