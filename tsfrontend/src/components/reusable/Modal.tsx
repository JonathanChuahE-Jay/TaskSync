import { AnimatePresence, motion } from 'framer-motion'
import { IconX } from '@tabler/icons-react'
import type { ReactNode } from 'react'
import { cn } from '@/utils/utils.ts'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	children: ReactNode
	title?: string
}

const backdropVariants = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.2 } },
	exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
}

const modalVariants = {
	hidden: { y: 40, opacity: 0, scale: 0.95 },
	visible: {
		y: 0,
		opacity: 1,
		scale: 1,
		transition: {
			type: 'spring',
			damping: 25,
			stiffness: 400,
			mass: 1,
		},
	},
	exit: {
		y: -10,
		opacity: 0,
		scale: 0.95,
		transition: {
			duration: 0.2,
			ease: [0.43, 0.13, 0.23, 0.96],
		},
	},
}

const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key="backdrop"
					className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm"
					variants={backdropVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					onClick={onClose}
					aria-modal="true"
					role="dialog"
				>
					<motion.div
						key="modal"
						className={cn(
							'bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 px-6 pb-6 pt-4 relative',
							!title && 'p-6 pt-8',
						)}
						variants={modalVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						onClick={(e) => e.stopPropagation()}
					>
						{title ? (
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-lg font-semibold text-gray-800">
									{title}
								</h2>
								<motion.button
									className="text-gray-400 hover:text-black hover:bg-gray-100 transition-colors w-8 h-8 flex items-center justify-center rounded-full"
									onClick={onClose}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									aria-label="Close modal"
								>
									<IconX className="size-6" />
								</motion.button>
							</div>
						) : (
							<motion.button
								className="text-gray-400 hover:text-black w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors absolute top-4 right-6"
								onClick={onClose}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								aria-label="Close modal"
							>
								<IconX />
							</motion.button>
						)}
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default Modal
