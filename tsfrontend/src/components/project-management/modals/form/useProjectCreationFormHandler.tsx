import { ZodError } from 'zod'
import type {ProjectCreationType} from '@/schema/projectsSchema.ts';
import type { ErrorResponse } from '@/types/errorResponse.ts'
import { useDefaultAppForm } from '@/components/common/defaultForm/DefaultAppForm.tsx'
import {
	projectCreationSchema
	
} from '@/schema/projectsSchema.ts'
import { formatZodError } from '@/utils/convertZodToJson.ts'
import { useCreateProjectMutation } from '@/queries/ProjectQueries.ts'

export const useProjectCreationFormHandler = ({
	setIsLoading,
	setApiErrors,
	onSuccess,
	onClose,
}: {
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
	setApiErrors: React.Dispatch<React.SetStateAction<ErrorResponse>>
	onSuccess: (() => void) | undefined
	onClose: () => void
}) => {
	const { mutateAsync } = useCreateProjectMutation()

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
		},
		onSubmit: async ({ value }: { value: ProjectCreationType }) => {
			try {
				setIsLoading(true)
				setApiErrors({})
				const data = projectCreationSchema.parse(value)

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
				await mutateAsync({ data: formData })
				setIsLoading(false)
				onClose()
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
		projectCreationForm,
	}
}
