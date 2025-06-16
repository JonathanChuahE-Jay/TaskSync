import type { ProjectListResponse } from '@/types/projectManagementTypes.ts'
import { handleKyError } from '@/utils/handleKyErrors.ts'
import { kyInstance } from '@/lib/ky.ts'
import { env } from '@/env.ts'

export const projectApi = {
	createProject: async ({ data }: { data: FormData }): Promise<Response> => {
		try {
			return await fetch(`${env.VITE_BACKEND_URL}projects/`, {
				method: 'POST',
				body: data,
				credentials: 'include',
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
