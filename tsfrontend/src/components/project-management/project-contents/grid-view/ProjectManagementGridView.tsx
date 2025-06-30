import { useMemo, useState } from 'react'
import type { ProjectListResponseType } from '@/types/projectManagementTypes.ts'
import ProjectManagementGridViewCard from '@/components/project-management/project-contents/grid-view/ProjectManagementGridViewCard.tsx'
import Pagination from '@/components/reusable/Pagination.tsx'
import ProjectManagementNoDataFound from '@/components/project-management/project-contents/grid-view/ProjectManagementNoDataFound.tsx'

const ProjectManagementGridView = ({
	data,
}: {
	data: Array<ProjectListResponseType>
}) => {
	const [currentPage, setCurrentPage] = useState(1)
	const [projectsPerPage, setProjectsPerPage] = useState(12)

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
		<div className="max-w-7xl mx-auto py-6 px-4 shadow-md p-4 mt-6 bg-white rounded-lg min-h-[950px] flex flex-col">
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
				{currentProjects.map((project) => (
					<ProjectManagementGridViewCard
						key={project.id}
						project={project}
					/>
				))}
			</div>

			{data.length === 0 && (
				<ProjectManagementNoDataFound />
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
					className="pt-4"
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
