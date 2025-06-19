import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const AuthModal = ({ children }: { children: ReactNode }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="relative z-10 scrollbar-hide bg-white/40 dark:bg-black/40 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/50 w-[600px] max-w-[90%] h-[90dvh] overflow-y-auto overflow-x-hidden p-8 transition duration-700 ease-in-out"
		>
			<div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
			<div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
			
			<div className="relative z-10 space-y-6">
				{children}
			</div>
		</motion.div>
	)
}

export default AuthModal
