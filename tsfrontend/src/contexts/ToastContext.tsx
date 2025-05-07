import { createContext, useContext, useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { ReactNode } from 'react'
import type { ToastProps } from '@/components/reusable/Toast.tsx'
import { ToastContainer } from '@/components/reusable/Toast.tsx'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastContextType {
	showToast: (message: string, type: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
	const [toasts, setToasts] = useState<Array<ToastProps>>([])

	const showToast = (message: string, type: ToastType, duration = 5000) => {
		const id = uuid()
		const toast = { id, message, type, duration, onClose: removeToast }
		setToasts((prevToasts) => [...prevToasts, toast])
	}

	const removeToast = (id: string) => {
		setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
	}

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<ToastContainer toasts={toasts} onClose={removeToast} />
		</ToastContext.Provider>
	)
}

export const useToast = (): ToastContextType => {
	const context = useContext(ToastContext)
	if (context === undefined) {
		throw new Error('useToast must be used within a ToastProvider')
	}
	return context
}
