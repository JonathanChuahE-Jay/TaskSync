import { motion } from 'framer-motion'
import {
	IconCalendarEvent,
	IconChartBar,
	IconClipboardList,
} from '@tabler/icons-react'
import type { ProjectManagementTabsIDType } from '@/types/projectManagementTypes'
import { useListProjectQuery } from '@/queries/ProjectQueries.ts'
import ProjectManagementGridView from '@/components/project-management/project-contents/grid-view/ProjectManagementGridView.tsx'

const ProjectList = () => (
	<div className="space-y-4">
		<h3 className="text-lg font-medium">Projects List</h3>
		{[1, 2, 3].map((item) => (
			<div
				key={item}
				className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
			>
				<div className="flex justify-between items-center">
					<div>
						<h4 className="font-medium">Project Alpha {item}</h4>
						<p className="text-sm text-gray-500">
							Last updated: 2 days ago
						</p>
					</div>
					<span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
						On Track
					</span>
				</div>
				<div className="mt-3 flex items-center gap-4">
					<div className="flex -space-x-2">
						{[1, 2, 3].map((avatar) => (
							<div
								key={avatar}
								className="w-6 h-6 rounded-full bg-indigo-300 border border-white"
							></div>
						))}
					</div>
					<div className="text-xs text-gray-500">Progress: 75%</div>
				</div>
			</div>
		))}
	</div>
)

const CalendarView = () => (
	<div className="border border-gray-200 rounded-lg p-4">
		<h3 className="text-lg font-medium mb-4 flex items-center gap-2">
			<IconCalendarEvent className="text-indigo-700" size={20} />
			Calendar View
		</h3>
		<div className="grid grid-cols-7 gap-1">
			{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
				<div key={day} className="text-center text-sm font-medium py-2">
					{day}
				</div>
			))}
			{Array.from({ length: 30 }, (_, i) => i + 1).map((date) => (
				<div
					key={date}
					className={`h-16 border border-gray-100 rounded p-1 text-sm hover:bg-gray-50 ${
						date === 15 || date === 22
							? 'bg-indigo-50 border-indigo-200'
							: ''
					}`}
				>
					<div className="font-medium">{date}</div>
					{date === 15 && (
						<div className="text-xs p-1 bg-indigo-100 rounded mt-1 text-indigo-800">
							Project Review
						</div>
					)}
					{date === 22 && (
						<div className="text-xs p-1 bg-blue-100 rounded mt-1 text-blue-800">
							Deadline
						</div>
					)}
				</div>
			))}
		</div>
	</div>
)

const ChartView = () => (
	<div className="border border-gray-200 rounded-lg p-4">
		<h3 className="text-lg font-medium mb-4 flex items-center gap-2">
			<IconChartBar className="text-indigo-700" size={20} />
			Performance Chart
		</h3>
		<div className="h-64 flex items-end justify-between gap-2 pt-8 relative">
			<div className="absolute left-0 right-0 top-0 border-b border-gray-200 flex justify-between">
				<span className="text-xs text-gray-500">Progress</span>
				<span className="text-xs text-gray-500">100%</span>
			</div>
			{[65, 40, 85, 30, 72, 55, 90].map((height, i) => (
				<div key={i} className="relative flex-1 group">
					<div
						className="bg-indigo-400 hover:bg-indigo-500 rounded-t transition-all duration-200"
						style={{ height: `${height}%` }}
					></div>
					<div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
						{height}%
					</div>
					<div className="text-xs text-center mt-1">Week {i + 1}</div>
				</div>
			))}
		</div>
	</div>
)

const TasksView = () => (
	<div className="border border-gray-200 rounded-lg p-4">
		<h3 className="text-lg font-medium mb-4 flex items-center gap-2">
			<IconClipboardList className="text-indigo-700" size={20} />
			Tasks Overview
		</h3>
		<div className="space-y-3">
			{[
				{
					name: 'Design wireframes',
					status: 'Completed',
					assigned: 'Alex',
					priority: 'High',
				},
				{
					name: 'API integration',
					status: 'In Progress',
					assigned: 'Sam',
					priority: 'High',
				},
				{
					name: 'User testing',
					status: 'Pending',
					assigned: 'Jess',
					priority: 'Medium',
				},
				{
					name: 'Documentation',
					status: 'Not Started',
					assigned: 'Taylor',
					priority: 'Low',
				},
				{
					name: 'Deployment',
					status: 'Pending',
					assigned: 'Team',
					priority: 'Critical',
				},
			].map((task, i) => (
				<div
					key={i}
					className="flex items-center justify-between p-3 border border-gray-100 rounded-md hover:bg-gray-50"
				>
					<div className="flex items-center gap-3">
						<input
							type="checkbox"
							checked={task.status === 'Completed'}
							className="rounded text-indigo-600"
						/>
						<span
							className={
								task.status === 'Completed'
									? 'line-through text-gray-400'
									: ''
							}
						>
							{task.name}
						</span>
					</div>
					<div className="flex items-center gap-4">
						<span
							className={`text-xs px-2 py-1 rounded-full ${
								task.status === 'Completed'
									? 'bg-green-100 text-green-800'
									: task.status === 'In Progress'
										? 'bg-blue-100 text-blue-800'
										: task.status === 'Pending'
											? 'bg-yellow-100 text-yellow-800'
											: 'bg-gray-100 text-gray-800'
							}`}
						>
							{task.status}
						</span>
						<span className="text-sm text-gray-500">{task.assigned}</span>
						<span
							className={`text-xs px-2 py-1 rounded-full ${
								task.priority === 'Critical'
									? 'bg-red-100 text-red-800'
									: task.priority === 'High'
										? 'bg-orange-100 text-orange-800'
										: task.priority === 'Medium'
											? 'bg-blue-100 text-blue-800'
											: 'bg-gray-100 text-gray-800'
							}`}
						>
							{task.priority}
						</span>
					</div>
				</div>
			))}
		</div>
	</div>
)



const ProjectManagementContent = ({
	activeTab,
}: {
	activeTab: ProjectManagementTabsIDType
}) => {
	const { data } = useListProjectQuery()

	const contentVariants = {
		initial: { opacity: 0, y: 10 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -10 },
	}

	if(!data) return null
	return (
		<motion.div
			key={activeTab}
			initial="initial"
			animate="animate"
			exit="exit"
			variants={contentVariants}
			transition={{ duration: 0.2 }}
			className="w-full"
		>
			{activeTab === 'grid' && <ProjectManagementGridView data={data} />}
			{activeTab === 'list' && <ProjectList />}
			{activeTab === 'calendar' && <CalendarView />}
			{activeTab === 'chart' && <ChartView />}
			{activeTab === 'tasks' && <TasksView />}
		</motion.div>
	)
}

export default ProjectManagementContent
