import type {
	ProjectListResponseType,
	ProjectRolesCreationResponseType,
} from '@/types/projectManagementTypes.ts'
import { handleKyError } from '@/utils/handleKyErrors.ts'
import { kyInstance } from '@/lib/ky.ts'
import type { Pagination } from '@/types/common.ts'

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

	listProjects: async (): Promise<Pagination<ProjectListResponseType>> => {
		try {
			return await kyInstance
				.get('projects/')
				.json<Pagination<ProjectListResponseType>>()
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
	}): Promise<Array<ProjectRolesCreationResponseType>> => {
		const createdRoles: Array<ProjectRolesCreationResponseType> = []
		for (const role of roles) {
			const response = await kyInstance.post(
				`projects/${projectId}/roles/`,
				{
					json: role,
				},
			)
			const createdRole:ProjectRolesCreationResponseType = await response.json()
			createdRoles.push(createdRole)
		}
		return createdRoles
	},

	createTeams: async ({
		projectId,
		userId,
		roleId,
	}: {
		projectId: string
		userId: string
		roleId: string | number
	}) => {
		await kyInstance.post(`projects/${projectId}/teams/`, {
			json: {
				user_id: userId,
				role_id: roleId,
			},
		})
	},
}
