import type { ProjectListResponse } from '@/types/projectManagementTypes.ts'
import { handleKyError } from '@/utils/handleKyErrors.ts'
import { kyInstance } from '@/lib/ky.ts'

export const projectApi = {
	createProject: async ({ data }: { data: FormData }) => {
		try {
			const response = await kyInstance.post('projects/', {
				body: data,
			})
			return response.json()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	listProjects: async (): Promise<Array<ProjectListResponse>> => {
		try {
			return await kyInstance
				.get('projects/')
				.json<Array<ProjectListResponse>>()
		} catch (err) {
			return await handleKyError(err)
		}
	},

	createRoles: async ({
		projectId,
		roles,
	}: {
		projectId: string
		roles: Array<{ name: string }>
	}) => {
		for (const role of roles) {
			await kyInstance.post(`projects/${projectId}/roles/`, {
				json: role,
			})
		}
	},
}
