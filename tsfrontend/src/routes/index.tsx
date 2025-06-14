import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	beforeLoad: () => {
	},
	component: App,
})

function App() {
	return (
		<div>
			/ Route
		</div>
	)
}
