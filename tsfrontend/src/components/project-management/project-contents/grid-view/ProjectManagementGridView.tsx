import { useMemo, useState } from 'react'
import type { ProjectListResponse } from '@/types/projectManagementTypes.ts'
import ProjectManagementGridViewCard from '@/components/project-management/project-contents/grid-view/ProjectManagementGridViewCard.tsx'
import Pagination from '@/components/reusable/Pagination.tsx'

const ProjectManagementGridView = ({
	data,
}: {
	data: Array<ProjectListResponse>
}) => {
	const [currentPage, setCurrentPage] = useState(1)
	const [projectsPerPage, setProjectsPerPage] = useState(9)

	const totalPages = useMemo(
		() => Math.ceil(data.length / projectsPerPage),
		[data.length, projectsPerPage],
	)

	const currentProjects = useMemo(() => {
		const indexOfLastProject = currentPage * projectsPerPage
		const indexOfFirstProject = indexOfLastProject - projectsPerPage
		return data.slice(indexOfFirstProject, indexOfLastProject)
	}, [data, currentPage, projectsPerPage])

	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(pageNumber)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handleItemsPerPageChange = (newSize: number) => {
		const firstItemCurrentView = (currentPage - 1) * projectsPerPage + 1
		const newPage = Math.max(1, Math.ceil(firstItemCurrentView / newSize))

		setProjectsPerPage(newSize)
		setCurrentPage(newPage)
	}

	return (
		<div className="max-w-7xl mx-auto py-6 px-4 shadow-md p-4 mt-6 bg-white rounded-lg min-h-[700px] flex flex-col">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
				{currentProjects.map((project) => (
					<ProjectManagementGridViewCard
						key={project.id}
						project={project}
					/>
				))}
			</div>

			{data.length === 0 && (
				<div className="text-center flex-1 flex flex-col items-center justify-center rounded-md">
					<svg
						className="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<h3 className="mt-2 text-lg font-medium text-gray-900">
						No projects found
					</h3>
					<p className="mt-1 text-sm text-gray-500">
						Get started by creating a new project.
					</p>
				</div>
			)}

			{data.length > 0 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
					itemsPerPage={projectsPerPage}
					totalItems={data.length}
					onItemsPerPageChange={handleItemsPerPageChange}
					pageSizeOptions={[9, 18, 36, 72]}
					className="border-t pt-4"
				/>
			)}
			{/*<div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-5">*/}
			{/*	<ProjectManagementGridViewStatsCard*/}
			{/*		title="Active Projects"*/}
			{/*		value="12"*/}
			{/*		icon="fa-folder"*/}
			{/*		bgColor="bg-green-100"*/}
			{/*		textColor="text-green-500"*/}
			{/*		trendText="8% increase"*/}
			{/*		trendUp={true}*/}
			{/*	/>*/}
			{/*	<ProjectManagementGridViewStatsCard*/}
			{/*		title="Tasks Due Today"*/}
			{/*		value="8"*/}
			{/*		icon="fa-calendar-day"*/}
			{/*		bgColor="bg-red-100"*/}
			{/*		textColor="text-red-500"*/}
			{/*		trendText="3 more than yesterday"*/}
			{/*		trendUp={true}*/}
			{/*	/>*/}
			{/*	<ProjectManagementGridViewStatsCard*/}
			{/*		title="Team Members"*/}
			{/*		value="24"*/}
			{/*		icon="fa-users"*/}
			{/*		bgColor="bg-blue-100"*/}
			{/*		textColor="text-blue-500"*/}
			{/*		trendText="2 pending invites"*/}
			{/*	/>*/}
			{/*	<ProjectManagementGridViewStatsCard*/}
			{/*		title="Completion Rate"*/}
			{/*		value="92%"*/}
			{/*		icon="fa-chart-line"*/}
			{/*		bgColor="bg-purple-100"*/}
			{/*		textColor="text-purple-500"*/}
			{/*		trendText="5% increase this month"*/}
			{/*		trendUp={true}*/}
			{/*	/>*/}
			{/*</div>*/}
		</div>
	)
}

export default ProjectManagementGridView
