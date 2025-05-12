import type { ErrorResponse } from '@/types/errorResponse.ts'

interface ErrorMessageProps {
	apiErrors: ErrorResponse
}

const ErrorMessage = ({ apiErrors }: ErrorMessageProps) => {
	if (!apiErrors.message || apiErrors.message === 'Validation error') return null

	return (
		<p className="text-red-500 my-2 text-sm font-medium">
			{apiErrors.message}
		</p>
	)
}

export default ErrorMessage
