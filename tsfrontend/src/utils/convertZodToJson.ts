import { ZodError } from 'zod'
import type { ErrorResponse } from '@/types/errorResponse.ts'

export function formatZodError(error: unknown): ErrorResponse {
	if (error instanceof ZodError) {
		const errorObj: ErrorResponse = {
			message: 'Validation error',
		}

		error.errors.forEach((err) => {
			const path = err.path

			let current: Record<string, any> = errorObj
			for (let i = 0; i < path.length - 1; i++) {
				const key = String(path[i])
				if (!current[key]) current[key] = {}
				current = current[key]
			}

			const lastKey = String(path[path.length - 1])
			current[lastKey] = err.message
		})

		return errorObj
	}

	if (error instanceof Error) {
		return { message: error.message }
	}

	return { message: String(error) }
}
