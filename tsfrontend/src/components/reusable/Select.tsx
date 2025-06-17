import React from 'react'
import { IconAlertCircle } from '@tabler/icons-react'
import { cn } from '@/utils/utils'

type SelectOption = {
	value: string
	label: string
	prefix?: React.ReactNode
}

type SelectProps = {
	label?: string
	placeholder?: string
	icon?: React.ReactNode
	value: string
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
	error?: string
	id?: string
	required?: boolean
	disabled?: boolean
	ref?: React.Ref<HTMLSelectElement>
	className?: string
	options: Array<SelectOption>
}

const Select: React.FC<SelectProps> = ({
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
	options = [],
}) => {
	const selectedOption = options.find((option) => option.value === value)
	const displayIcon = selectedOption?.prefix || icon

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
				<div className="absolute left-3 z-10 top-1/2 -translate-y-1/2 text-black dark:text-white transition duration-700">
					{displayIcon}
				</div>
				<select
					id={id}
					disabled={disabled}
					className={cn(
						'w-full px-10 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200 shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 hover:border-slate-300 appearance-none',
						className,
					)}
					value={value}
					onChange={onChange}
				>
					{placeholder && (
						<option value="" disabled>
							{placeholder}
						</option>
					)}
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
					<svg
						className="h-5 w-5 text-gray-400"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</div>
			</div>
			{error && (
				<p className="mt-1 text-sm text-rose-500 flex items-center">
					<IconAlertCircle className="size-4 mr-1" stroke={1.5} />
					{error}
				</p>
			)}
		</div>
	)
}

export default Select
