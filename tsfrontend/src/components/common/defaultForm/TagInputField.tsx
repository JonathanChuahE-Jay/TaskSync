import React, { useRef, useState } from 'react'
import { IconAlertCircle, IconPlus, IconTags, IconX } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { KeyboardEvent } from 'react';
import { cn } from '@/utils/utils'
import { useDefaultFieldContext } from '@/components/common/defaultForm/DefaultAppForm.tsx'

interface TagInputFieldProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		'prefix' | 'value'
	> {
	label?: string
	error?: string | undefined
	tooltip?: React.ReactNode
	prefix?: React.ReactNode
	tagInputClassName?: string
	clearFieldError?: (fieldName: string) => void
	apiErrors?: Record<string, string | undefined>
	maxTags?: number
}

const TagInputField = React.forwardRef<HTMLInputElement, TagInputFieldProps>(
	(
		{
			label = 'Tags',
			error,
			tooltip,
			prefix = <IconTags className="size-5" />,
			tagInputClassName,
			clearFieldError = () => {},
			apiErrors = {},
			maxTags = 10,
			...props
		},
		ref,
	) => {
		const field = useDefaultFieldContext<Array<string>>()
		const [inputValue, setInputValue] = useState<string>('')
		const [maxTagsReached, setMaxTagsReached] = useState(false)
		const inputRef = useRef<HTMLInputElement>(null)

		if (!Array.isArray(field.state.value)) {
			field.handleChange([])
		}

		const tags = Array.isArray(field.state.value) ? field.state.value : []
		const isAtMaxTags = maxTags > 0 && tags.length >= maxTags

		React.useEffect(() => {
			setMaxTagsReached(isAtMaxTags)
		}, [tags.length, maxTags])

		const handleAddTag = () => {
			const trimmedValue = inputValue.trim()
			if (!trimmedValue || isAtMaxTags) return

			if (!tags.includes(trimmedValue)) {
				const newTags = [...tags, trimmedValue]
				field.handleChange(newTags)
				clearFieldError(field.name)
			}

			setInputValue('')
			inputRef.current?.focus()
		}

		const handleRemoveTag = (indexToRemove: number) => {
			const newTags = tags.filter((_, index) => index !== indexToRemove)
			field.handleChange(newTags)

			if (isAtMaxTags) {
				setMaxTagsReached(false)
			}
		}

		const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
			if ((e.key === 'Enter' || e.key === ',') && !isAtMaxTags) {
				e.preventDefault()
				handleAddTag()
			} else if (
				e.key === 'Backspace' &&
				inputValue === '' &&
				tags.length > 0
			) {
				handleRemoveTag(tags.length - 1)
			}
		}

		return (
			<div className="relative">
				{label && (
					<label
						htmlFor={field.name}
						className="block text-sm font-medium text-slate mb-1.5 pointer-events-none"
					>
						{label}{' '}
						{props.required && <span className="text-rose-500">*</span>}
						{maxTags > 0 && (
							<span className="ml-1 text-xs font-normal text-slate-500">
								(max {maxTags})
							</span>
						)}
					</label>
				)}

				<div className="relative group">
					<div className="absolute left-3 z-10 top-1/2 -translate-y-1/2 text-black dark:text-white transition duration-700 pointer-events-none">
						{prefix}
					</div>

					<div className="relative">
						<input
							ref={(node) => {
								// Handle both refs
								if (typeof ref === 'function') {
									ref(node)
								} else if (ref) {
									ref.current = node
								}
								inputRef.current = node
							}}
							id={field.name}
							type="text"
							className={cn(
								'w-full px-10 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200 shadow-sm placeholder:text-gray-500/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 hover:border-slate-300',
								isAtMaxTags && 'opacity-60 cursor-not-allowed',
								tagInputClassName,
							)}
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={handleKeyDown}
							onBlur={() => {
								if (inputValue.trim() && !isAtMaxTags) {
									handleAddTag()
								}
							}}
							placeholder={
								isAtMaxTags ? 'Maximum tags reached' : props.placeholder
							}
							disabled={isAtMaxTags || props.disabled}
							{...props}
						/>

						{!isAtMaxTags && (
							<button
								type="button"
								className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600"
								onClick={handleAddTag}
								disabled={!inputValue.trim() || isAtMaxTags}
							>
								<IconPlus
									size={20}
									stroke={1.5}
									className="text-black"
								/>
							</button>
						)}
					</div>
				</div>

				{maxTagsReached && !error && (
					<div className="flex items-center mt-2 text-amber-600 text-sm">
						<IconAlertCircle className="size-4 mr-1" stroke={1.5} />
						<p>Maximum number of tags reached ({maxTags})</p>
					</div>
				)}

				{error && <p className="mt-1 text-sm text-rose-500">{error}</p>}

				<div className="flex flex-wrap gap-2 mt-3">
					<AnimatePresence>
						{tags.map((tag, index) => (
							<motion.span
								key={index}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{
									opacity: 0,
									scale: 0.8,
									transition: { duration: 0.15 },
								}}
								className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
							>
								{tag}
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation()
										handleRemoveTag(index)
									}}
									className="ml-1.5 text-blue-600 hover:text-blue-800 focus:outline-none"
								>
									<IconX className="size-3.5" stroke={2} />
								</button>
							</motion.span>
						))}
					</AnimatePresence>
				</div>

				{tags.length > 0 && (
					<div className="mt-1.5 text-xs text-slate-500">
						{tags.length} tag{tags.length !== 1 ? 's' : ''} added
						{maxTags > 0 && ` (${maxTags - tags.length} remaining)`}
					</div>
				)}
			</div>
		)
	},
)

export default TagInputField
