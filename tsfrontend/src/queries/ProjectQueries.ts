import { useMutation, useQuery } from '@tanstack/react-query'
import { projectApi } from '@/services/projectServices.ts'
import { queryClient } from '@/lib/tanstack.ts'

export function useCreateProjectMutation() {
	return useMutation({
		mutationFn: ({ data }: { data: FormData }) =>
			projectApi.createProject({ data }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] })
		},
	})
}

export function useListProjectMutation() {
	return useQuery({
		queryKey: ['projects'],
		queryFn: projectApi.listProjects,
		retry: 1,
		staleTime: 10 * 60 * 1000,
		gcTime: 15 * 60 * 1000,
	})
}

export function useCreateProjectRolesMutation() {
	return useMutation({
		mutationFn: ({
			projectId,
			roles,
		}: {
			projectId: string;
			roles: Array<{ name: string }>;
		}) => projectApi.createRoles({ projectId, roles }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['projects'] });
		},
	});
}
