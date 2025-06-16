import { useMutation, useQuery } from '@tanstack/react-query'
import type { ProjectCreationType } from '@/schema/projectsSchema.ts'
import { projectApi } from '@/services/projectServices.ts'

export function useCreateProjectMutation() {
	return useMutation({
		mutationFn: (data: { data: ProjectCreationType }) =>
			projectApi.createProject(data),
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