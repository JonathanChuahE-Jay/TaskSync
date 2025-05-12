import axios from 'axios'
import { env } from '@/env.ts'

const Axios = axios.create({
	baseURL: env.VITE_BACKEND_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
})

Axios.interceptors.request.use(
	(config) => {
		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)

Axios.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		if (error.response) {
			if (error.response.status === 401) {
				console.log('Authentication error')
			}

			return Promise.reject({
				status: error.response.status,
				data: error.response.data,
				message: error.response.data?.message || 'An error occurred',
			})
		}

		return Promise.reject({
			status: 0,
			message: 'Network error. Please check your connection.',
			data: null,
		})
	},
)

export default Axios
