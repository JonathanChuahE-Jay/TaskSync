import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type {
	ProjectManagementSortOptionType,
	projectManagementTabsIDType,
} from '@/types/projectManagementTypes'
import ProjectManagementHeader from '@/components/project-management/ProjectManagementHeader.tsx'
import ProjectManagementTool from '@/components/project-management/ProjectManagementTool'
import ProjectManagementContent from '@/components/project-management/ProjectManagementContent'
import ProjectManagementCreateModal from '@/components/project-management/modals/ProjectManagementCreateModal.tsx'

export const Route = createFileRoute('/(members)/project-management')({
	component: RouteComponent,
})

function RouteComponent() {
	const [searchContent, setSearchContent] = useState('')
	const [activeTab, setActiveTab] =
		useState<projectManagementTabsIDType>('list')
	const [sortOption, setSortOption] =
		useState<ProjectManagementSortOptionType>('Recent updated')
	const [createProjectModal, setCreateProjectModal] = useState(false)
	return (
		<section className="max-w-7xl mx-auto p-4">
			<ProjectManagementHeader
				setCreateProjectModal={setCreateProjectModal}
				setSearchContent={setSearchContent}
				searchContent={searchContent}
			/>
			<ProjectManagementTool
				sortOption={sortOption}
				setSortOption={setSortOption}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<div className="w-full mt-4">
				<AnimatePresence mode="wait">
					<ProjectManagementContent activeTab={activeTab} />
				</AnimatePresence>
			</div>
			<ProjectManagementCreateModal
				isOpen={createProjectModal}
				onClose={() => setCreateProjectModal(false)}
			/>
		</section>
	)
}
