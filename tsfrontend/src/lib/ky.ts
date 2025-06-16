import ky from 'ky'
import type { KyInstance } from 'ky'
import { env } from '@/env.ts'

export const kyInstance: KyInstance = ky.create({
	prefixUrl: env.VITE_BACKEND_URL,
	credentials: 'include',
	// hooks: {
	// 	// beforeRequest: [
	// 	// 	(request) => {
	// 	// 		if (!(request.body instanceof FormData)) {
	// 	// 			request.headers.set('Content-Type', 'application/json')
	// 	// 		}
	// 	// 	},
	// 	// ],
	// },
})

export const debugKyInstance = ({
	debugKey,
	kyIns,
}: {
	debugKey: string
	kyIns: KyInstance
}) => {
	return kyIns.extend({
		hooks: {
			beforeRequest: [
				async (request) => {
					sessionStorage.setItem(
						`${debugKey}-StartTime`,
						String(performance.now()),
					)

					const clone = request.clone()

					let body
					try {
						if (clone.body instanceof FormData) {
							body = Object.fromEntries(clone.body.entries())
						} else {
							body = await clone.json()
						}
					} catch (error) {
						body = 'Unable to parse body'
					}

					console.log(
						debugKey,
						`Request Sent at ${performance.now()}:`,
						body,
					)
				},
			],
			afterResponse: [
				async (_req, _opt, response) => {
					const timeStart = Number(
						sessionStorage.getItem(`${debugKey}-StartTime`),
					)
					const timeReceived = performance.now()
					const totalTimeElapsed = timeReceived - timeStart

					let body
					try {
						body = await response.clone().json()
					} catch (error) {
						body = await response.clone().text()
					}

					console.log(
						debugKey,
						`Response Received at ${performance.now()} :`,
						body,
						`. Total time taken ${totalTimeElapsed}ms`,
					)
				},
			],
		},
	})
}
