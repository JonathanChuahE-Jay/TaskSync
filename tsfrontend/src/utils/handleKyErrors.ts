import { HTTPError } from 'ky'

export const handleKyError = async (err: unknown) => {
	if (err instanceof HTTPError) {
		const errorResponse = await err.response.json()
		console.log(errorResponse)

		if (
			errorResponse &&
			typeof errorResponse === 'object' &&
			!Array.isArray(errorResponse) &&
			!('detail' in errorResponse || 'message' in errorResponse)
		) {
			throw errorResponse
		}

		throw {
			message:
				errorResponse?.detail ||
				errorResponse?.message ||
				'An unexpected error occurred',
		}
	}

	throw { message: 'Unexpected error' }
}

// import { HTTPError } from 'ky'
//
// export const handleKyError = async (err: unknown) => {
// 	if (err instanceof HTTPError) {
// 		const errorResponse = await err.response.json()
// 		throw { message: errorResponse.message || errorResponse.detail || 'An unexpected error occurred' }
// 	}
// 	throw { message: 'Unexpected error' }
// }
