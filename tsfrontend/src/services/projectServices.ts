import type { ProjectListResponse } from '@/types/projectManagementTypes.ts'
import { handleKyError } from '@/utils/handleKyErrors.ts'
import { kyInstance } from '@/lib/ky.ts'

export const projectApi = {
	createProject: async ({ data }: { data: FormData }) => {
		try {
			return await kyInstance.post('projects/', {
				body: data,
			})
		} catch (err) {
			return await handleKyError(err)
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
