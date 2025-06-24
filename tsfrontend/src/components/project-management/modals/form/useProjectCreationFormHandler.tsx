import { ZodError } from 'zod'
import type { ProjectCreationType } from '@/schema/projectsSchema.ts'
import type { ErrorResponse } from '@/types/errorResponse.ts'
import { useDefaultAppForm } from '@/components/common/defaultForm/DefaultAppForm.tsx'
import { projectCreationSchema } from '@/schema/projectsSchema.ts'
import { formatZodError } from '@/utils/convertZodToJson.ts'
import {
	useCreateProjectMutation,
	useCreateProjectRolesMutation,
	useCreateProjectTeamMutation,
} from '@/queries/ProjectQueries.ts'
import { useListFriendsQuery } from '@/queries/FriendQueries.ts'
import { kyInstance } from '@/lib/ky.ts'

export const useProjectCreationFormHandler = ({
	setIsLoading,
	setApiErrors,
	onSuccess,
	onClose,
}: {
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
	setApiErrors: React.Dispatch<React.SetStateAction<ErrorResponse>>
	onSuccess: (() => void) | undefined
	onClose: React.Dispatch<React.SetStateAction<boolean>>
}) => {
	const { mutateAsync } = useCreateProjectMutation()
	const { mutateAsync: rolesMutateAsync } = useCreateProjectRolesMutation()
	const { mutateAsync: teamMutateAsync } = useCreateProjectTeamMutation()
	const { data: friends } = useListFriendsQuery()

	const projectCreationForm = useDefaultAppForm({
		defaultValues: {
			title: '',
			description: '',
			status: 'not_started',
			start_date: '',
			due_date: '',
			priority: '',
			colors: '#000000',
			attachments: [] as Array<File>,
			tags: [] as Array<string>,
			roles: [] as Array<string>,
			teamMember: [] as Array<{
				friendId: string
				userId: string
				name: string
				role: string
			}>,
		},
		onSubmit: async ({ value }: { value: ProjectCreationType }) => {
			try {
				console.log(value)
				setIsLoading(true)
				setApiErrors({})
				const data = projectCreationSchema.parse(value)

				// Prepare form data
				const formData = new FormData()
				formData.append('title', data.title)
				if (data.description)
					formData.append('description', data.description)
				if (data.status) formData.append('status', data.status)
				if (data.start_date) formData.append('start_date', data.start_date)
				if (data.due_date) formData.append('due_date', data.due_date)
				if (data.priority) formData.append('priority', data.priority)
				if (data.colors) formData.append('colors', data.colors)
				if (data.tags && Array.isArray(data.tags)) {
					data.tags.forEach((tag, index) => {
						formData.append(`tags[${index}]`, tag)
					})
				}
				if (data.attachments && data.attachments.length > 0) {
					for (const file of data.attachments) {
						formData.append('attachments', file)
					}
				}

				// Step 1: Create the project
				const project = await mutateAsync({ data: formData })

				// Step 2: Create roles and collect role data
				const roleMap = new Map<string, number | string>() // To store role name -> role id mapping

				for (const roleName of data.roles) {
					const roleResponse = await rolesMutateAsync({
						projectId: project.id,
						roles: [{ name: roleName }],
					})

					console.log('role', roleResponse)

					// Handle the array response since the data shows it returns an array
					if (Array.isArray(roleResponse) && roleResponse.length > 0) {
						const role = roleResponse[0] // Get the first item from the array
						if (role && role.id) {
							roleMap.set(roleName, role.id)
						}
					}
				}

				// If we couldn't get the role IDs, fetch all roles for the project
				if (roleMap.size < data.roles.length) {
					const rolesResponse = await kyInstance
						.get(`projects/${project.id}/roles/`)
						.json()
					for (const role of rolesResponse) {
						const matchingRoleName = data.roles.find(
							(name) => name === role.name,
						)
						if (matchingRoleName && !roleMap.has(matchingRoleName)) {
							roleMap.set(matchingRoleName, role.id)
						}
					}
				}

				console.log('member', value.teamMember)
				console.log('roleMap', roleMap)

				// Step 3: Create team members using the role IDs
				if (value.teamMember && value.teamMember.length > 0) {
					for (const member of value.teamMember) {
						const roleId = roleMap.get(member.role)
						if (roleId) {
							await teamMutateAsync({
								projectId: project.id,
								userId: member.userId,
								roleId: roleId,
							})
						} else {
							console.error(`Role ID not found for role: ${member.role}`)
						}
					}
				}

				setIsLoading(false)
				onClose(false)
				if (onSuccess) onSuccess()
			} catch (error) {
				setIsLoading(false)
				if (error instanceof ZodError) {
					setApiErrors(formatZodError(error))
				} else {
					const err = error as Error
					setApiErrors(err)
				}
			}
		},
	})

	return {
		friends,
		projectCreationForm,
	}
}
