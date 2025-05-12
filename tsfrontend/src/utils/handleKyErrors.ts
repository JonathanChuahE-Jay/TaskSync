import { HTTPError } from 'ky'

export const handleKyError = async (err: unknown) => {
	if (err instanceof HTTPError) {
		const errorResponse = await err.response.json()
		throw { message: errorResponse.message || errorResponse.detail || 'An unexpected error occurred' }
	}
	throw { message: 'Unexpected error' }
}
