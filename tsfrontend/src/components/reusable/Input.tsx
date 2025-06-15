import React, { useState } from 'react'
import { IconEye, IconEyeOff, IconX } from '@tabler/icons-react'
import { cn } from '@/utils/utils'

type InputProps = {
	label?: string
	type: string
	placeholder?: string
	icon?: React.ReactNode
	value: string | number | ReadonlyArray<string> | boolean
	checked?: boolean
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	error?: string
	id?: string
	required?: boolean
	disabled?: boolean
	ref?: React.Ref<HTMLInputElement>
	className?: string
	showClearButton?: boolean
}

const Input: React.FC<InputProps> = ({
	label,
	type,
	placeholder,
	icon,
	value,
	checked,
	onChange,
	error,
	id,
	className,
	disabled = false,
	required = false,
	showClearButton = false,
}) => {
	const [showPassword, setShowPassword] = useState(false)
	const inputType = type === 'password' && showPassword ? 'text' : type

	const shouldShowClearButton =
		showClearButton &&
		typeof value === 'string' &&
		value.length > 0 &&
		type !== 'password' &&
		!disabled

	const handleClear = () => {
		const syntheticEvent = {
			target: { value: '' }
		} as React.ChangeEvent<HTMLInputElement>

		onChange(syntheticEvent)
	}

	if (type === 'checkbox') {
		return (
			<div className="flex items-center">
				<input
					disabled={disabled}
					id={id}
					type="checkbox"
					checked={checked}
					onChange={onChange}
					className={cn("h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500", className)}
				/>
				{label && (
					<label
						htmlFor={id}
						className="ml-2 block text-sm text-slate cursor-pointer"
					>
						{label}
					</label>
				)}
			</div>
		)
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
				<div className="absolute left-3 z-10 top-1/2 -translate-y-1/2 text-black dark:text-white transition duration-700">
					{icon}
				</div>
				<input
					id={id}
					type={inputType}
					disabled={disabled}
					className={cn(
						"w-full px-10 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200 shadow-sm placeholder:text-gray-500/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 hover:border-slate-300",
						shouldShowClearButton || type === 'password' ? "pr-10" : "",
						className
					)}
					placeholder={placeholder}
					value={typeof value === 'boolean' ? '' : (value as string)}
					onChange={onChange}
				/>

				{type === 'password' && (
					<div
						className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? (
							<IconEyeOff
								size={20}
								stroke={1.5}
								className="text-black"
							/>
						) : (
							<IconEye size={20} stroke={1.5} className="text-black" />
						)}
					</div>
				)}

				{shouldShowClearButton && (
					<div
						className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600 z-10"
						onClick={handleClear}
						aria-label="Clear input"
					>
						<IconX
							size={20}
							stroke={1.5}
							className="text-black"
						/>
					</div>
				)}
			</div>
			{error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
		</div>
	)
}

export default Input