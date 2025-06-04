import { createFileRoute } from '@tanstack/react-router'
import Avatar from '@/components/reusable/Avatar.tsx'

export const Route = createFileRoute('/(members)/dashboard')({
	component: RouteComponent,
})

function RouteComponent() {
	return <Avatar src="/profile.jpg" alt="User Profile" size='xl' />
}
