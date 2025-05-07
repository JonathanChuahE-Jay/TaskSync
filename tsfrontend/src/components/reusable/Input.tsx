import React, { useState } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

type InputProps = {
	label: string
	type: string
	placeholder: string
	icon: React.ReactNode
	value: string | boolean
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	error?: string
	id?: string
	required?: boolean
	disabled?: boolean
}

const Input: React.FC<InputProps> = ({
	label,
	type,
	placeholder,
	icon,
	value,
	onChange,
	error,
	id,
	disabled = false,
	required = false,
}) => {
	const [showPassword, setShowPassword] = useState(false)
	const inputType = type === 'password' && showPassword ? 'text' : type

	if (type === 'checkbox') {
		return (
			<div className="flex items-center">
				<input
					disabled={disabled}
					id={id || label.toLowerCase().replace(/\s+/g, '-')}
					type="checkbox"
					checked={value as boolean}
					onChange={onChange}
					className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
				/>
				<label
					htmlFor={id || label.toLowerCase().replace(/\s+/g, '-')}
					className="ml-2 block text-sm text-slate-700 hover:text-slate-900 cursor-pointer"
				>
					{label}
				</label>
			</div>
		)
	}

	return (
		<div className="relative">
			<label
				htmlFor={id || label.toLowerCase().replace(/\s+/g, '-')}
				className="block text-sm font-medium text-slate-700 mb-1.5"
			>
				{label} {required && <span className="text-rose-500">*</span>}
			</label>
			<div className="relative group">
				<div className="absolute left-3 top-1/2 -translate-y-1/2 text-black">
					{icon}
				</div>
				<input
					id={id || label.toLowerCase().replace(/\s+/g, '-')}
					type={inputType}
					disabled={disabled}
					className="w-full px-10 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200
                   hover:border-slate-300"
					placeholder={placeholder}
					value={value as string}
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
			</div>
			{error && <p className="mt-1 text-sm text-rose-500">{error}</p>}
		</div>
	)
}

export default Input
