import type { ZodError } from 'zod'

export interface ErrorResponse {
	general?: string
	message?: string
	detail?: string
	zodErrors?: ReturnType<ZodError['flatten']>

	[key: string]: any
}
