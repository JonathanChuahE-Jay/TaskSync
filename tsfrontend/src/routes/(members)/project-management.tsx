import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(members)/project-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(members)/project-management"!</div>
}
