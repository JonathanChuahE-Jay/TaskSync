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
   const [projects, setProjects] =
     useState<Array<ProjectListResponseType>>(data)
   const [draggedItem, setDraggedItem] =
     useState<ProjectListResponseType | null>(null)
   const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null)

	useState(() => {
		setProjects(data)
	}, [data])

	const totalPages = useMemo(
		() => Math.ceil(projects.length / projectsPerPage),
		[projects.length, projectsPerPage],
	)

	const currentProjects = useMemo(() => {
		const indexOfLastProject = currentPage * projectsPerPage
		const indexOfFirstProject = indexOfLastProject - projectsPerPage
		return projects.slice(indexOfFirstProject, indexOfLastProject)
	}, [projects, currentPage, projectsPerPage])

	const handleDragStart = (
		e: React.DragEvent,
		project: ProjectListResponseType,
	) => {
		setDraggedItem(project)
		e.dataTransfer.effectAllowed = 'move'
	}

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
		if (draggedOverIndex !== index) {
			setDraggedOverIndex(index)
		}
	}

	const handleDragLeave = () => {
		setDraggedOverIndex(null)
	}

	const handleDrop = (e: React.DragEvent, dropIndex: number) => {
		e.preventDefault()
		setDraggedOverIndex(null)

		if (!draggedItem) return

		const globalDropIndex = (currentPage - 1) * projectsPerPage + dropIndex
		const draggedIndex = projects.findIndex((p) => p.id === draggedItem.id)

		if (draggedIndex === globalDropIndex) return

		const newProjects = [...projects]
		newProjects.splice(draggedIndex, 1)
		newProjects.splice(globalDropIndex, 0, draggedItem)

		setProjects(newProjects)
		setDraggedItem(null)

		console.log(`Project "${draggedItem.title}" moved to position ${globalDropIndex + 1}`,
		)
	}

	const handleDragEnd = () => {
		setDraggedItem(null)
		setDraggedOverIndex(null)
	}

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
		<div className="max-w-7xl mx-auto py-6 px-4 shadow-md p-4 mt-6 bg-white rounded-lg min-h-[1000px] flex flex-col">
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
				{currentProjects.map((project, index) => (
					<div
						key={project.id}
						onDragOver={(e) => handleDragOver(e, index)}
						onDragLeave={handleDragLeave}
						onDrop={(e) => handleDrop(e, index)}
						className="relative h-full"
					>
						{draggedOverIndex === index && (
							<div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-xl z-10 pointer-events-none" />
						)}
						<ProjectManagementGridViewCard
							project={project}
							onDragStart={handleDragStart}
							onDragEnd={handleDragEnd}
							isDragging={draggedItem?.id === project.id}
							position={(currentPage - 1) * projectsPerPage + index + 1}
						/>
					</div>
				))}
			</div>
			{projects.length === 0 && <ProjectManagementNoDataFound />}
			{projects.length > 0 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
					itemsPerPage={projectsPerPage}
					totalItems={projects.length}
					onItemsPerPageChange={handleItemsPerPageChange}
					pageSizeOptions={[9, 18, 36, 72]}
					className="pt-4"
				/>
			)}
		</div>
	)
}
export default ProjectManagementGridView
