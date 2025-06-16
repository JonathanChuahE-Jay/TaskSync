import { Link, useRouterState } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/utils.ts'
import { navGroups } from '@/data/navItemsData.tsx'

const Sidebar = () => {
	const { location } = useRouterState()

	return (
		<motion.aside
			className="group w-16 hover:w-64 transition-all duration-300 bg-sidebar text-sidebar-foreground shadow-md h-screen flex flex-col fixed top-0 left-0 overflow-hidden z-20"
			initial={false}
		>
			<div className="h-16 flex items-center justify-center group-hover:justify-start px-4 whitespace-nowrap">
				<img src="/logo.png" alt="Logo" className="h-10" />
				<AnimatePresence>
					{/* Logo text animation */}
					<motion.div
						className="ml-4 text-lg font-bold overflow-hidden"
						initial={{ opacity: 0, width: 0 }}
						animate={{
							opacity: 1,
							width: 'auto',
							transition: { duration: 0.25 },
						}}
						exit={{ opacity: 0, width: 0 }}
						key="logo-text"
					>
						<span className="hidden group-hover:inline">Task Sync</span>
					</motion.div>
				</AnimatePresence>
			</div>

			<nav className="flex-1 flex flex-col px-2 py-2 overflow-y-auto">
				{navGroups.map((group, groupIndex) => (
					<div key={group.title} className="mb-3">
						<div className="h-5 mb-3 relative">
							<AnimatePresence>
								<motion.div
									className="absolute inset-x-0 px-3"
									initial={{ opacity: 0, y: -5 }}
									animate={{
										opacity: 1,
										y: 0,
										transition: {
											duration: 0.2,
											delay: 0.05 * groupIndex,
										},
									}}
									exit={{
										opacity: 0,
										y: -5,
										transition: { duration: 0.1 },
									}}
								>
									<span className="hidden group-hover:block text-xs font-semibold text-muted-foreground">
										{group.title}
									</span>
								</motion.div>
							</AnimatePresence>
						</div>

						<div className="space-y-0.5">
							{group.items.map((item, itemIndex) => {
								const isActive = location.pathname.startsWith(item.to)

								return (
									<Link
										key={item.to}
										to={item.to}
										className={cn(
											`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap`,
											isActive
												? 'bg-sidebar-primary text-sidebar-primary-foreground'
												: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
										)}
									>
										{/* Icon with fixed width */}
										<div className="w-6 text-center flex-shrink-0">
											<span className="text-xl">{item.icon}</span>
										</div>

										{/* Text with animation */}
										<AnimatePresence>
											<motion.div
												className="ml-3 overflow-hidden"
												initial={{ opacity: 0, width: 0 }}
												animate={{
													opacity: 1,
													width: 'auto',
													transition: {
														duration: 0.25,
														delay:
															0.1 +
															0.05 * itemIndex +
															0.08 * groupIndex,
													},
												}}
												exit={{
													opacity: 0,
													width: 0,
													transition: { duration: 0.1 },
												}}
											>
												<span className="hidden group-hover:inline">
													{item.name}
												</span>
											</motion.div>
										</AnimatePresence>
									</Link>
								)
							})}
						</div>
					</div>
				))}
			</nav>
		</motion.aside>
	)
}

export default Sidebar
