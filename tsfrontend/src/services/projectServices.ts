import type { ProjectCreationType } from '@/schema/projectsSchema.ts'
import type { ProjectListResponse } from '@/types/projectManagementTypes.ts'
import { handleKyError } from '@/utils/handleKyErrors.ts'
import { kyInstance } from '@/lib/ky.ts'
import { env } from '@/env.ts'

export const projectApi = {
	// Update your createProject API function
	createProject: async ({
		data,
	}: {
		data: ProjectCreationType
	}): Promise<ProjectCreationType> => {
		try {
			const hasFiles = data.attachments && data.attachments.length > 0

			if (hasFiles) {
				const formData = new FormData()

				formData.append('title', data.title)
				if (data.description)
					formData.append('description', data.description)
				formData.append('status', data.status)
				if (data.start_date) formData.append('start_date', data.start_date)
				if (data.due_date) formData.append('due_date', data.due_date)
				if (data.priority) formData.append('priority', data.priority)
				if (data.colors) formData.append('colors', data.colors)

				if (data.tags && data.tags.length > 0) {
					data.tags.forEach((tag, index) => {
						if (tag.trim()) {
							// Only add non-empty tags
							formData.append(`tags[${index}]`, tag.trim())
						}
					})
				}

				if (data.attachments.length > 0) {
					formData.append('attachments', data.attachments[0])
				}

				for (let [key, value] of formData.entries()) {
					console.log(`${key}:`, value)
				}

				const response = await fetch(`${env.VITE_BACKEND_URL}projects/`, {
					method: 'POST',
					credentials: 'include',
					body: formData,
				})

				if (!response.ok) {
					const errorText = await response.text()
					throw new Error(`HTTP ${response.status}: ${errorText}`)
				}

				return await response.json()
			} else {
				const { attachments, ...jsonData } = data
				return await kyInstance
					.post('projects/', {
						json: jsonData,
					})
					.json()
			}
		} catch (err) {
			console.error('Error creating project:', err)
			throw err
		}
	},
	listProjects: async (): Promise<ProjectListResponse> => {
		try {
			return await kyInstance.get('projects/').json<ProjectListResponse>()
		} catch (err) {
			return await handleKyError(err)
		}
	},
}
