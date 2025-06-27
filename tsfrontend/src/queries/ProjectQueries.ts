import { useMutation, useQuery } from '@tanstack/react-query'
import type {
	ProjectListResponseType,
	ProjectRolesCreationResponseType,
	ProjectRolesCreationType,
} from '@/types/projectManagementTypes.ts'
import { projectApi } from '@/services/projectServices.ts'
import { queryClient } from '@/lib/tanstack.ts'

export function useCreateProjectMutation() {
	return useMutation<ProjectListResponseType, Error, { data: FormData }>({
		mutationFn: ({ data }: { data: FormData }) =>
			projectApi.createProject({
				data,
			}) as Promise<ProjectListResponseType>,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] })
		},
	})
}

export function useListProjectQuery() {
	return useQuery({
		queryKey: ['projects'],
		queryFn: projectApi.listProjects,
		retry: 1,
		staleTime: 10 * 60 * 1000,
		gcTime: 15 * 60 * 1000,
	})
}

export function useCreateProjectRolesMutation() {
	return useMutation<
		Array<ProjectRolesCreationResponseType>,
		Error,
		ProjectRolesCreationType
	>({
		mutationFn: ({ projectId, roles }) =>
			projectApi.createRoles({ projectId, roles }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] })
		},
	})
}

export function useCreateProjectTeamMutation() {
	return useMutation({
		mutationFn: ({
			projectId,
			userId,
			roleId,
		}: {
			projectId: string
			userId: string
			roleId: string | number
		}) => projectApi.createTeams({ projectId, userId, roleId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] })
		},
	})
}
