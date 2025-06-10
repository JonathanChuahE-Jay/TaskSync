import type { ErrorResponse } from '@/types/errorResponse.ts'

export function flattenErrorResponse(err: ErrorResponse): string {
	const messages: Array<string> = []
	const collect = (obj: any) => {
		for (const key in obj) {
			if (typeof obj[key] === 'object') collect(obj[key])
			else if (typeof obj[key] === 'string') messages.push(`${key}: ${obj[key]}`)
		}
	}
	collect(err)
	return messages.join(', ')
}