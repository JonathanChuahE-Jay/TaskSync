import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
	IconCheck,
	IconExclamationCircle,
	IconInfoCircle,
	IconX,
} from '@tabler/icons-react'

export interface ToastContainerProps {
	toasts: Array<ToastProps>
	onClose: (id: string) => void
	direction?:
		| 'top-left'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-right'
		| 'top-center'
		| 'bottom-center'
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

const progressColors = {
	success: '#10B981',
	error: '#EF4444',
	warning: '#F59E0B',
	info: '#3B82F6',
}

export const Toast = ({
	id,
	message,
	type,
	duration = 3000,
	onClose,
}: ToastProps) => {
	const [progress, setProgress] = useState(0)
	const intervalRef = useRef<number | null>(null)
	const timerRef = useRef<number | null>(null)

	useEffect(() => {
		if (intervalRef.current) clearInterval(intervalRef.current)
		if (timerRef.current) clearTimeout(timerRef.current)

		intervalRef.current = window.setInterval(() => {
			setProgress((prev) => {
				const newProgress = prev + 100 / (duration / 100)
				return newProgress >= 100 ? 100 : newProgress
			})
		}, 100)

		timerRef.current = window.setTimeout(() => {
			onClose(id)
		}, duration)

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
			if (timerRef.current) clearTimeout(timerRef.current)
		}
	}, [duration, id, onClose])

	useEffect(() => {
		if (progress >= 100) {
			onClose(id)
		}
	}, [progress, id, onClose])

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: -20, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -20, scale: 0.9 }}
			transition={{ type: 'spring', stiffness: 500, damping: 30 }}
			className={`relative overflow-hidden shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border ${toastStyles[type]}`}
			style={{ width: 'auto', maxWidth: '24rem' }}
		>
			<div className="flex-1 p-4">
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
				className="absolute bottom-0 left-0 h-1 transition-all duration-100 ease-out"
				style={{
					width: `${progress}%`,
					backgroundColor: progressColors[type],
				}}
			/>
		</motion.div>
	)
}

export const ToastContainer = ({
	toasts,
	onClose,
	direction = 'top-right',
}: ToastContainerProps) => {
	const getPositionClasses = () => {
		switch (direction) {
			case 'top-left':
				return 'top-0 left-0 items-start'
			case 'top-right':
				return 'top-0 right-0 items-end'
			case 'bottom-left':
				return 'bottom-0 left-0 items-start'
			case 'bottom-right':
				return 'bottom-0 right-0 items-end'
			case 'top-center':
				return 'top-0 left-1/2 -translate-x-1/2 items-center'
			case 'bottom-center':
				return 'bottom-0 left-1/2 -translate-x-1/2 items-center'
			default:
				return 'top-0 right-0 items-end'
		}
	}

	const getAnimationDirection = () => {
		if (direction.includes('top')) {
			return { initial: { y: -20 }, animate: { y: 0 }, exit: { y: -20 } }
		} else if (direction.includes('bottom')) {
			return { initial: { y: 20 }, animate: { y: 0 }, exit: { y: 20 } }
		}
		return { initial: { y: -20 }, animate: { y: 0 }, exit: { y: -20 } }
	}

	const animationProps = getAnimationDirection()

	return (
		<div
			className={`fixed p-4 z-50 flex flex-col space-y-2 pointer-events-none ${getPositionClasses()}`}
		>
			<AnimatePresence>
				{toasts.map((toast) => (
					<motion.div
						key={toast.id}
						initial={animationProps.initial}
						animate={animationProps.animate}
						exit={animationProps.exit}
						transition={{ type: 'spring', stiffness: 500, damping: 30 }}
					>
						<Toast {...toast} onClose={onClose} />
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	)
}
