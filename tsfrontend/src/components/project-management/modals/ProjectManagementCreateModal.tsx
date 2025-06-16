import { useState } from 'react'
import { motion } from 'framer-motion'
import {
	IconAlertCircle,
	IconAlertTriangle,
	IconCalendar,
	IconChecks,
	IconCircleDashed,
	IconCircleOff,
	IconColorSwatch,
	IconFlag,
	IconFlame,
	IconHandStop,
	IconList,
	IconNotesOff,
	IconPaperclip,
	IconProgress,
} from '@tabler/icons-react'
import { ZodError } from 'zod'
import type { ErrorResponse } from '@/types/errorResponse.ts'
import type { ProjectCreationType } from '@/schema/projectsSchema.ts'
import Modal from '@/components/reusable/Modal.tsx'
import { useDefaultAppForm } from '@/components/common/defaultForm/DefaultAppForm.tsx'
import ErrorMessage from '@/components/reusable/ErrorMessage.tsx'
import { useClearFieldError } from '@/hooks/useClearFieldError.tsx'
import { useCreateProjectMutation } from '@/queries/ProjectQueries.ts'
import { projectCreationSchema } from '@/schema/projectsSchema.ts'
import { formatZodError } from '@/utils/convertZodToJson.ts'

interface ProjectManagementCreateModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess?: () => void
}

const ProjectManagementCreateModal = ({
	isOpen,
	onClose,
	onSuccess,
}: ProjectManagementCreateModalProps) => {
	const [isLoading, setIsLoading] = useState(false)
	const [apiErrors, setApiErrors] = useState<ErrorResponse>({})
	const clearFieldError = useClearFieldError(apiErrors, setApiErrors)
	const { mutateAsync } = useCreateProjectMutation()
	const form = useDefaultAppForm({
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
				if (data.description) formData.append('description', data.description)
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
					setApiErrors({ message: err.message || 'Create project failed' })
				}
			}
		},
	})

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Create a Project">
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
				className="space-y-5"
			>
				<form className="space-y-5">
					<form.AppField name="title">
						{(field) => (
							<field.InputField
								label="Project Title"
								placeholder="Enter project title"
								required
								clearFieldError={clearFieldError}
								apiErrors={apiErrors}
							/>
						)}
					</form.AppField>

					<form.AppField name="description">
						{(field) => (
							<field.TextareaField
								label="Description"
								placeholder="Describe the project"
								rows={3}
								clearFieldError={clearFieldError}
								apiErrors={apiErrors}
							/>
						)}
					</form.AppField>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<form.AppField name="start_date">
							{(field) => (
								<field.InputField
									label="Start Date"
									type="date"
									prefix={<IconCalendar className="size-5" />}
									clearFieldError={clearFieldError}
									apiErrors={apiErrors}
								/>
							)}
						</form.AppField>

						<form.AppField name="due_date">
							{(field) => (
								<field.InputField
									label="Due Date"
									type="date"
									prefix={<IconCalendar className="size-5" />}
									clearFieldError={clearFieldError}
									apiErrors={apiErrors}
								/>
							)}
						</form.AppField>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<form.AppField name="status">
							{(field) => (
								<field.SelectField
									label="Status"
									options={[
										{
											prefix: (
												<IconNotesOff className="size-5 text-gray-500" />
											),
											value: 'not_started',
											label: 'Not Started',
										},
										{
											prefix: (
												<IconProgress className="size-5 text-blue-600" />
											),
											value: 'in_progress',
											label: 'In Progress',
										},
										{
											prefix: (
												<IconChecks className="size-5 text-green-600" />
											),
											value: 'completed',
											label: 'Completed',
										},
										{
											prefix: (
												<IconHandStop className="size-5 text-yellow-600" />
											),
											value: 'on_hold',
											label: 'On Hold',
										},
									]}
									prefix={<IconList className="size-5" />}
									clearFieldError={clearFieldError}
									apiErrors={apiErrors}
								/>
							)}
						</form.AppField>

						<form.AppField name="priority">
							{(field) => (
								<field.SelectField
									label="Priority"
									options={[
										{
											prefix: (
												<IconCircleOff className="size-5 text-gray-600" />
											),
											value: 'none',
											label: 'None',
										},
										{
											prefix: (
												<IconCircleDashed className="size-5 text-blue-600" />
											),
											value: 'low',
											label: 'Low',
										},
										{
											prefix: (
												<IconAlertCircle className="size-5 text-yellow-600" />
											),
											value: 'medium',
											label: 'Medium',
										},
										{
											prefix: (
												<IconAlertTriangle className="size-5 text-orange-600" />
											),
											value: 'high',
											label: 'High',
										},
										{
											prefix: (
												<IconFlame className="size-5 text-red-600" />
											),
											value: 'critical',
											label: 'Critical',
										},
									]}
									prefix={<IconFlag className="size-5" />}
									clearFieldError={clearFieldError}
									apiErrors={apiErrors}
								/>
							)}
						</form.AppField>
					</div>
					<form.AppField name="tags">
						{(field) => (
							<field.TagInputField
								label="Tags (optional)"
								placeholder="Add tags (e.g., research, frontend, urgent)"
								clearFieldError={clearFieldError}
								apiErrors={apiErrors}
							/>
						)}
					</form.AppField>
					<form.AppField name="colors">
						{(field) => (
							<field.InputField
								label="Colors (optional)"
								type="color"
								prefix={<IconColorSwatch className="size-5" />}
								clearFieldError={clearFieldError}
								apiErrors={apiErrors}
							/>
						)}
					</form.AppField>

					<form.AppField name="attachments">
						{(field) => (
							<field.InputField
								maxFiles={3}
								multiple={true}
								label="Attachments (optional)"
								type="file"
								accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
								prefix={<IconPaperclip className="size-5" />}
								clearFieldError={clearFieldError}
								apiErrors={apiErrors}
							/>
						)}
					</form.AppField>

					<ErrorMessage apiErrors={apiErrors} />

					<form.AppForm>
						<form.SubmitButton
							label="Create Project"
							loadingLabel="Creating Project"
							dynamicText={true}
							sideBySide={true}
							variant="bars"
							isLoading={isLoading}
						/>
					</form.AppForm>
				</form>
			</motion.div>
		</Modal>
	)
}

export default ProjectManagementCreateModal
