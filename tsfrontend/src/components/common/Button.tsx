import { cn } from '@/utils/utils'

export const Button = ({
	onClick,
	children,
	className,
}: {
	onClick?: () => void
	children: React.ReactNode
	className?: string
}) => {
	return (
		<button
			onClick={onClick}
			className={cn(
				'flex items-center gap-1 border px-3 py-1.5 rounded-md',
				className,
			)}
		>
			{children}
		</button>
	)
}
