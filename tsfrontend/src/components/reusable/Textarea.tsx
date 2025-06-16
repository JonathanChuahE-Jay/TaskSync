import React from 'react'
import { IconX } from '@tabler/icons-react'
import { cn } from '@/utils/utils'

type TextareaProps = {
	label?: string
	placeholder?: string
	icon?: React.ReactNode
	value: string
	onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
	error?: string
	id?: string
	required?: boolean
	disabled?: boolean
	ref?: React.Ref<HTMLTextAreaElement>
	className?: string
	showClearButton?: boolean
	rows?: number
}

const Textarea: React.FC<TextareaProps> = ({
	label,
	placeholder,
	icon,
	value,
	onChange,
	error,
	id,
	className,
	disabled = false,
	required = false,
	showClearButton = false,
	rows = 4,
}) => {
	const shouldShowClearButton =
		showClearButton && value.length > 0 && !disabled

	const handleClear = () => {
		const syntheticEvent = {
			target: { value: '' },
		} as React.ChangeEvent<HTMLTextAreaElement>
		onChange(syntheticEvent)
	}

	return (
		<div className="relative">
			{label && (
				<label
					htmlFor={id}
					className="block text-sm font-medium text-slate mb-1.5"
				>
					{label} {required && <span className="text-rose-500">*</span>}
				</label>
			)}
			<div className="relative group">
				{icon && (
					<div className="absolute left-3 z-10 top-3.5 text-black dark:text-white transition duration-700">
						{icon}
					</div>
				)}
				<textarea
					id={id}
					disabled={disabled}
					className={cn(
						'w-full px-10 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200 shadow-sm placeholder:text-gray-500/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 hover:border-slate-300',
						shouldShowClearButton ? 'pr-10' : '',
						className,
					)}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					rows={rows}
				/>
				{shouldShowClearButton && (
					<div
						className="absolute right-3 top-3.5 text-slate-400 cursor-pointer hover:text-slate-600 z-10"
						onClick={handleClear}
						aria-label="Clear textarea"
					>
						<IconX size={20} stroke={1.5} className="text-black" />
					</div>
				)}
			</div>
			{error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
		</div>
	)
}

export default Textarea
