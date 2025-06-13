import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(members)/task-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(members)/task-management"!</div>
}
