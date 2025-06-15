import { createFileRoute } from '@tanstack/react-router'
import ProjectManagementHeader from '@/components/project-management/ProjectManagementHeader.tsx'
import { useState } from 'react'
import ProjectManagementTool from '@/components/project-management/ProjectManagementTool';
import { AnimatePresence } from 'framer-motion';
import ProjectManagementContent from '@/components/project-management/ProjectManagementContent';
import type { ProjectManagementSortOptionType, projectManagementTabsIDType } from '@/types/projectManagementTypes';

export const Route = createFileRoute('/(members)/project-management')({
  component: RouteComponent,
})

function RouteComponent() {
  const [searchContent, setSearchContent] = useState('');
    const [activeTab, setActiveTab] = useState<projectManagementTabsIDType>('list');
    const [sortOption, setSortOption] = useState<ProjectManagementSortOptionType>('Recent updated');
  return (
    <section className="max-w-7xl mx-auto p-4">
      <ProjectManagementHeader setSearchContent={setSearchContent} searchContent={searchContent} />
      <ProjectManagementTool sortOption={sortOption} setSortOption={setSortOption}  activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full mt-4">
        <AnimatePresence mode="wait">
          <ProjectManagementContent activeTab={activeTab} />
        </AnimatePresence>
      </div>
    </section>
  )
}
