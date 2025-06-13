import { createFileRoute } from '@tanstack/react-router'
import ProjectManagementHeader from '@/components/project-management/ProjectManagementHeader.tsx'

export const Route = createFileRoute('/(members)/project-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
	  <section className="max-w-7xl mx-auto py-5">
			<ProjectManagementHeader />
	  </section>
  )
}
