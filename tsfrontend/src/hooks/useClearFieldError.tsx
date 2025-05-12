import { useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { ErrorResponse } from '@/types/errorResponse.ts'

export const useClearFieldError = (
	apiErrors: ErrorResponse,
	setApiErrors: Dispatch<SetStateAction<ErrorResponse>>,
) => {
	return useCallback(
		(fieldName: string) => {
			if (apiErrors[fieldName] || apiErrors.general) {
				setApiErrors((prev) => {
					const newErrors = { ...prev }
					delete newErrors[fieldName]
					delete newErrors.general
					return newErrors
				})
			}
		},
		[apiErrors, setApiErrors],
	)
}
