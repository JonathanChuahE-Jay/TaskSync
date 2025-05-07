import { createFileRoute } from '@tanstack/react-router'
import Register from '@/components/auth/register/Register.tsx'

export const Route = createFileRoute('/register')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<Register />
		</div>
	)
}
