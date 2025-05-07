import { createFileRoute } from '@tanstack/react-router'
import Login from '@/components/auth/login/Login.tsx'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<div>
			<Login />
		</div>
	)
}
