import { ZodError } from 'zod'

/**
 * Formats a ZodError into a nested JSON structure or returns the original error
 * @param error The error to format (can be ZodError or any other error)
 * @returns A formatted error object with nested structure for ZodErrors
 */
export function formatZodError(error: unknown): Record<string, any> {
    if (error instanceof ZodError) {
        const errorObj: Record<string, any> = {}

        error.errors.forEach((err) => {
            const path = err.path

            let current: Record<string, any> = errorObj
            for (let i = 0; i < path.length - 1; i++) {
                const key = String(path[i])
                if (!current[key]) current[key] = {}
                current = current[key]
            }

            const lastKey = String(path[path.length - 1])
			  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (lastKey !== undefined) {
                current[lastKey] = err.message
            }
        })

        return errorObj
    }

    if (error instanceof Error) {
        return { error: error.message }
    }

    return { error: String(error) }
}
