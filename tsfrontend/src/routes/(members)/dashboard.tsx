import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(members)/dashboard')({
	component: RouteComponent,
})

function RouteComponent() {
	return(
		<div>
			dasdsa
		</div>
	)
}
