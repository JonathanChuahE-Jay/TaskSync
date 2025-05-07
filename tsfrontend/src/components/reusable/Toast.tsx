import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
	IconCheck,
	IconExclamationCircle,
	IconInfoCircle,
	IconX,
} from '@tabler/icons-react'

export interface ToastContainerProps {
	toasts: Array<ToastProps>
	onClose: (id: string) => void
}

export interface ToastProps {
	id: string
	message: string
	type: 'success' | 'error' | 'warning' | 'info'
	duration?: number
	onClose: (id: string) => void
}

const toastIcons = {
	success: <IconCheck className="h-6 w-6 text-green-500" />,
	error: <IconX className="h-6 w-6 text-red-500" />,
	warning: <IconExclamationCircle className="h-6 w-6 text-yellow-500" />,
	info: <IconInfoCircle className="h-6 w-6 text-blue-500" />,
}

const toastStyles = {
	success:
		'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600',
	error: 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600',
	warning:
		'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-600',
	info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600',
}

export const Toast = ({
	id,
	message,
	type,
	duration = 5000,
	onClose,
}: ToastProps) => {
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		const timer = setTimeout(() => {
			onClose(id)
		}, duration)

		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev < 100) {
					return prev + 100 / (duration / 100)
				}
				return 100
			})
		}, 100)

		return () => {
			clearTimeout(timer)
			clearInterval(interval)
		}
	}, [duration, id, onClose])

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: -20, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -20, scale: 0.9 }}
			transition={{ type: 'spring', stiffness: 500, damping: 30 }}
			className={`max-w-md w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border ${toastStyles[type]}`}
		>
			<div className="flex-1 w-0 p-4">
				<div className="flex items-start">
					<div className="flex-shrink-0">{toastIcons[type]}</div>
					<div className="ml-3 flex-1">
						<p className="text-sm font-medium text-gray-900 dark:text-gray-100">
							{message}
						</p>
					</div>
				</div>
			</div>
			<div className="flex border-l border-gray-200 dark:border-gray-700">
				<button
					onClick={() => onClose(id)}
					className="w-full h-full p-4 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
				>
					<IconX className="h-5 w-5" aria-hidden="true" />
				</button>
			</div>
			<div
				className="absolute bottom-0 left-0 h-1 bg-current transition-all duration-100 ease-out"
				style={{
					width: `${progress}%`,
					backgroundColor:
						type === 'success'
							? '#10B981'
							: type === 'error'
								? '#EF4444'
								: type === 'warning'
									? '#F59E0B'
									: '#3B82F6',
				}}
			/>
		</motion.div>
	)
}
export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
	return (
		<div className="fixed top-0 right-0 p-4 z-50 flex flex-col items-end space-y-2 pointer-events-none">
			<AnimatePresence>
				{toasts.map((toast) => (
					<Toast key={toast.id} {...toast} onClose={onClose} />
				))}
			</AnimatePresence>
		</div>
	)
}
