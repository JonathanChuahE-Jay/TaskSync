import { Link, useRouterState } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/utils.ts'
import { navGroups } from '@/data/navItemsData.tsx'

interface SidebarProps {
	isExpanded: boolean
	onExpandedChange: (expanded: boolean) => void
}

const Sidebar = ({ isExpanded, onExpandedChange }: SidebarProps) => {
	const { location } = useRouterState()

	return (
		<motion.aside
			className={cn(
				'transition-all duration-300 bg-sidebar text-sidebar-foreground shadow-lg h-full flex flex-col fixed top-0 left-0 overflow-hidden z-30 scrollbar-hide',
				isExpanded ? 'w-64' : 'w-16',
			)}
			initial={false}
			onMouseEnter={() => onExpandedChange(true)}
			onMouseLeave={() => onExpandedChange(false)}
		>
			<div className="h-16 flex items-center justify-center px-4 whitespace-nowrap border-b border-sidebar-border">
				<img src="/logo.png" alt="Logo" className="h-10 flex-shrink-0" />
				<AnimatePresence>
					{isExpanded && (
						<motion.div
							className="ml-4 text-lg font-bold overflow-hidden"
							initial={{ opacity: 0, width: 0 }}
							animate={{
								opacity: 1,
								width: 'auto',
								transition: { duration: 0.25, delay: 0.1 },
							}}
							exit={{
								opacity: 0,
								width: 0,
								transition: { duration: 0.15 },
							}}
							key="logo-text"
						>
							<span>Task Sync</span>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<nav className="flex-1 flex flex-col px-2 py-4 overflow-y-hide scrollbar-hide">
				{navGroups.map((group, groupIndex) => (
					<div key={group.title} className="mb-4">
						<div className="h-5 mb-3 relative">
							<AnimatePresence>
								{isExpanded && (
									<motion.div
										className="absolute inset-x-0 px-3"
										initial={{ opacity: 0, y: -5 }}
										animate={{
											opacity: 1,
											y: 0,
											transition: {
												duration: 0.2,
												delay: 0.15 + 0.05 * groupIndex,
											},
										}}
										exit={{
											opacity: 0,
											y: -5,
											transition: { duration: 0.1 },
										}}
										key={`group-${groupIndex}`}
									>
										<span className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
											{group.title}
										</span>
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						<div className="space-y-1">
							{group.items.map((item, itemIndex) => {
								const isActive = location.pathname.startsWith(item.to)
								return (
									<Link
										key={item.to}
										to={item.to}
										className={cn(
											'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap relative group/item',
											isActive
												? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
												: 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
										)}
										title={!isExpanded ? item.name : undefined}
									>
										<div className="w-6 text-center flex-shrink-0">
											<span className="text-xl">{item.icon}</span>
										</div>

										<AnimatePresence>
											{isExpanded && (
												<motion.div
													className="ml-3 overflow-hidden"
													initial={{ opacity: 0, width: 0 }}
													animate={{
														opacity: 1,
														width: 'auto',
														transition: {
															duration: 0.25,
															delay:
																0.2 +
																0.03 * itemIndex +
																0.05 * groupIndex,
														},
													}}
													exit={{
														opacity: 0,
														width: 0,
														transition: { duration: 0.15 },
													}}
													key={`item-${itemIndex}`}
												>
													<span>{item.name}</span>
												</motion.div>
											)}
										</AnimatePresence>

										{!isExpanded && (
											<div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
												{item.name}
											</div>
										)}
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
