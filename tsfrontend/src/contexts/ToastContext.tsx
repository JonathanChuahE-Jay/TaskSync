import { createContext, useContext, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { ReactNode } from 'react'
import type { ToastProps } from '@/components/reusable/Toast.tsx'
import { ToastContainer } from '@/components/reusable/Toast.tsx'

type ToastType = 'success' | 'error' | 'warning' | 'info'
type ToastDirection =
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right'
	| 'top-center'
	| 'bottom-center'

interface ToastOptions {
	message?: string
	type?: ToastType
	duration?: number
	direction?: ToastDirection
}

interface EnhancedToastProps extends ToastProps {
	direction?: ToastDirection
	active: boolean
}

type ToastArg = string | number | ToastOptions

interface ToastContextType {
	toast: (...args: Array<ToastArg>) => void
}

const MAX_ACTIVE_TOASTS = 3

type DirectionRecord = Record<string, Array<EnhancedToastProps>>

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({
	children,
	defaultDirection = 'top-right',
	defaultDuration = 3000,
}: {
	children: ReactNode
	defaultDirection?: ToastDirection
	defaultDuration?: number
}) => {
	const [toasts, setToasts] = useState<Array<EnhancedToastProps>>([])

	useEffect(() => {
		const directionMap: DirectionRecord = {}

		const toastsByDir = toasts.reduce((acc, toast) => {
			const dir = toast.direction || defaultDirection
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			acc[dir] = acc[dir] || []
			acc[dir].push(toast)
			return acc
		}, directionMap)

		const updatedToasts = [...toasts]
		let hasChanges = false

		Object.keys(toastsByDir).forEach((dir) => {
			const dirToasts = toastsByDir[dir]
			const activeToasts = dirToasts.filter((t) => t.active)
			const queuedToasts = dirToasts.filter((t) => !t.active)

			if (
				activeToasts.length < MAX_ACTIVE_TOASTS &&
				queuedToasts.length > 0
			) {
				const toActivate = Math.min(
					MAX_ACTIVE_TOASTS - activeToasts.length,
					queuedToasts.length,
				)

				for (let i = 0; i < toActivate; i++) {
					const index = updatedToasts.findIndex(
						(t) => t.id === queuedToasts[i].id,
					)
					if (index !== -1) {
						updatedToasts[index] = {
							...updatedToasts[index],
							active: true,
						}
						hasChanges = true
					}
				}
			}
		})

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (hasChanges) {
			setToasts(() => updatedToasts)
		}
	}, [toasts, defaultDirection])

	const toast = (...args: Array<ToastArg>) => {
		let message = ''
		let type: ToastType = 'info'
		let duration = defaultDuration
		let direction = defaultDirection

		args.forEach((arg) => {
			if (typeof arg === 'string') {
				if (
					arg === 'success' ||
					arg === 'error' ||
					arg === 'warning' ||
					arg === 'info'
				) {
					type = arg
				} else {
					message = arg
				}
			} else if (typeof arg === 'number') {
				duration = arg
			} else {
				if (arg.message) message = arg.message
				if (arg.type) type = arg.type
				if (arg.duration) duration = arg.duration
				if (arg.direction) direction = arg.direction
			}
		})

		if (!message) {
			console.warn('Toast message is required')
			return
		}

		const id = uuid()

		setToasts((prevToasts) => {
			const activeToastsForDir = prevToasts.filter(
				(t) => (t.direction || defaultDirection) === direction && t.active,
			).length

			const active = activeToastsForDir < MAX_ACTIVE_TOASTS

			const newToast = {
				id,
				message,
				type,
				duration,
				direction,
				onClose: removeToast,
				active,
			}

			return [...prevToasts, newToast]
		})
	}

	const removeToast = (id: string) => {
		setToasts((prevToasts) =>
			prevToasts.filter((currentToast) => currentToast.id !== id),
		)
	}

	const initialDirectionMap: Record<
		ToastDirection,
		Array<EnhancedToastProps>
	> = {
		'top-left': [],
		'top-right': [],
		'bottom-left': [],
		'bottom-right': [],
		'top-center': [],
		'bottom-center': [],
	}

	const activeToastsByDirection = toasts.reduce(
		(acc, toast) => {
			if (toast.active) {
				const direction = toast.direction || defaultDirection
				acc[direction].push(toast)
			}
			return acc
		},
		{ ...initialDirectionMap },
	)

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			{Object.entries(activeToastsByDirection).map(
				([direction, directionToasts]) =>
					directionToasts.length > 0 && (
						<ToastContainer
							key={direction}
							toasts={directionToasts}
							onClose={removeToast}
							direction={direction as ToastDirection}
						/>
					),
			)}
		</ToastContext.Provider>
	)
}

export const useToast = (): ToastContextType => {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}
