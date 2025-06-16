import { z } from 'zod'

export const projectCreationSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	start_date: z.string().nullable().optional(),
	due_date: z.string().nullable().optional(),
	status: z.string().optional(),
	attachments: z.any().optional(),
	progress_percentage: z.number().optional(),
	colors: z.any().optional(),
	priority: z.string().optional(),
	tags: z.array(z.string()).optional(),
})

export type ProjectCreationType = z.infer<typeof projectCreationSchema>
