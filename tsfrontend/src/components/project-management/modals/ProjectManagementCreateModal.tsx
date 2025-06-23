import { useState } from 'react'
import { motion } from 'framer-motion'
import {
	IconAlertCircle,
	IconAlertTriangle,
	IconCalendar,
	IconCalendarStats,
	IconChecks,
	IconCircleDashed,
	IconCircleOff,
	IconColorSwatch,
	IconFlame,
	IconHandStop,
	IconList,
	IconNotesOff,
	IconPaperclip,
	IconProgress,
} from '@tabler/icons-react'
import { useAtom } from 'jotai'
import type { ErrorResponse } from '@/types/errorResponse.ts'
import Modal from '@/components/reusable/Modal.tsx'
import ErrorMessage from '@/components/reusable/ErrorMessage.tsx'
import { useClearFieldError } from '@/hooks/useClearFieldError.tsx'
import { ProjectStatus } from '@/types/projectManagementTypes.ts'
import { useProjectCreationFormHandler } from '@/components/project-management/modals/form/useProjectCreationFormHandler.tsx'
import { isOpenCreateProjectModalAtom } from '@/jotai/projectManagementAtom.ts'

interface ProjectManagementCreateModalProps {
	onSuccess?: () => void
}

const ProjectManagementCreateModal = ({
	onSuccess,
}: ProjectManagementCreateModalProps) => {
	const [isOpen, onClose] = useAtom(isOpenCreateProjectModalAtom)
	const [isLoading, setIsLoading] = useState(false)
	const [apiErrors, setApiErrors] = useState<ErrorResponse>({})
	const clearFieldError = useClearFieldError(apiErrors, setApiErrors)

	const { projectCreationForm } = useProjectCreationFormHandler({
		onClose,
		onSuccess,
		setIsLoading,
		setApiErrors,
	})

	const form = projectCreationForm
	return (
		<Modal
			isOpen={isOpen}
			onClose={() => onClose(false)}
			title="Create a Project"
		>
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
								required
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
											value: ProjectStatus.NOT_STARTED,
											label: 'Not Started',
										},
										{
											prefix: (
												<IconProgress className="size-5 text-blue-600" />
											),
											value: ProjectStatus.IN_PROGRESS,
											label: 'In Progress',
										},
										{
											prefix: (
												<IconChecks className="size-5 text-green-600" />
											),
											value: ProjectStatus.COMPLETED,
											label: 'Completed',
										},
										{
											prefix: (
												<IconHandStop className="size-5 text-yellow-600" />
											),
											value: ProjectStatus.ON_HOLD,
											label: 'On Hold',
										},
										{
											prefix: (
												<IconCalendarStats className="size-5 text-indigo-600" />
											),
											value: ProjectStatus.PLANNING,
											label: 'Planning',
										},
										{
											prefix: (
												<IconAlertTriangle className="size-5 text-orange-600" />
											),
											value: ProjectStatus.AT_RISK,
											label: 'At Risk',
										},
										{
											prefix: (
												<IconAlertCircle className="size-5 text-red-600" />
											),
											value: ProjectStatus.CRITICAL,
											label: 'Critical',
										},
									]}
									prefix={<IconList className="size-5" />}
									clearFieldError={clearFieldError}
									apiErrors={apiErrors}
								/>
							)}
						</form.AppField>
						<form.AppField name="roles" mode="array">
							{(field) => (
								<field.RolesInputField
									label="User Roles"
									placeholder="Add role and press Enter"
									InputFieldClassName="my-custom-input"
									dropdownClassName="custom-dropdown"
									tagClassName="custom-tag"
									tagsContainerClassName="custom-tags-container"
									removeButtonClassName="custom-remove-btn"
									clearFieldError={clearFieldError}
									apiErrors={apiErrors}
								/>
							)}
						</form.AppField>
					</div>
					<form.AppField name="priority">
						{(field) => (
							<field.RadioField
								label="Priority"
								options={[
									{
										prefix: (
											<IconCircleOff className="size-5 text-gray-600" />
										),
										value: 'none',
										label: 'None',
										description: 'No priority assigned',
									},
									{
										prefix: (
											<IconCircleDashed className="size-5 text-blue-600" />
										),
										value: 'low',
										label: 'Low',
										description: 'Can be addressed later',
									},
									{
										prefix: (
											<IconAlertCircle className="size-5 text-yellow-600" />
										),
										value: 'medium',
										label: 'Medium',
										description: 'Should be addressed soon',
									},
									{
										prefix: (
											<IconAlertTriangle className="size-5 text-orange-600" />
										),
										value: 'high',
										label: 'High',
										description: 'Important issue to fix',
									},
									{
										prefix: (
											<IconFlame className="size-5 text-red-600" />
										),
										value: 'critical',
										label: 'Critical',
										description: 'Requires immediate attention',
									},
								]}
								orientation="vertical"
								clearFieldError={clearFieldError}
								apiErrors={apiErrors}
							/>
						)}
					</form.AppField>
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
