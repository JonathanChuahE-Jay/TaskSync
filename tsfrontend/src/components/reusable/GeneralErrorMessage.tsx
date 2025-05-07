import type { ErrorApiResponse } from '@/types/errorResponse.ts'

interface GeneralErrorMessageProps {
	apiErrors: ErrorApiResponse
}

const GeneralErrorMessage = ({ apiErrors }: GeneralErrorMessageProps) => {
	if (!apiErrors.general) return null
	return (
		<p className="text-red-500 my-2 text-sm font-medium">
			{apiErrors.general}
		</p>
	)
}

export default GeneralErrorMessage
