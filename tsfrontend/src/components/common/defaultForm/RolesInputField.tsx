import { IconList } from '@tabler/icons-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDefaultFieldContext } from './DefaultAppForm'
import Input from '@/components/reusable/Input'

interface RolesInputFieldProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		'prefix' | 'value'
	> {
	label?: string
	darker?: boolean
	error?: string | undefined
	tooltip?: React.ReactNode
	prefix?: React.ReactNode
	InputFieldClassName?: string
	clearFieldError?: (fieldName: string) => void
	apiErrors?: Record<string, string | undefined>
	dropdownClassName?: string
	tagClassName?: string
	tagsContainerClassName?: string
	removeButtonClassName?: string
	placeholder?: string
	darkMode?: boolean
	duplicateErrorMessage?: string
	suggestions?: Array<string>
	showSuggestionsOnFocus?: boolean
}

const DEFAULT_SUGGESTIONS = [
	'Project Leader',
	'Project Member',
	'Administrator',
	'Developer',
	'Designer',
	'Viewer',
	'Guest',
]

const RolesInputField = React.forwardRef<
	HTMLInputElement,
	RolesInputFieldProps
>(
	(
		{
			label = 'Roles',
			error,
			tooltip,
			prefix = <IconList className="size-5" />,
			InputFieldClassName,
			clearFieldError = () => {},
			apiErrors = {},
			dropdownClassName,
			tagClassName,
			tagsContainerClassName,
			removeButtonClassName,
			placeholder = 'Add a role and press Enter',
			darkMode = false,
			duplicateErrorMessage = 'This role already exists',
			suggestions = DEFAULT_SUGGESTIONS,
			showSuggestionsOnFocus = true,
			...props
		},
		ref,
	) => {
		const field = useDefaultFieldContext<Array<string>>()
		const [inputValue, setInputValue] = useState('')
		const [isFocused, setIsFocused] = useState(false)
		const [duplicateError, setDuplicateError] = useState<string | null>(null)
		const inputRef = useRef<HTMLInputElement>(null)
		const dropdownRef = useRef<HTMLDivElement>(null)

		const filteredSuggestions = useMemo(() => {
			if (!inputValue && !showSuggestionsOnFocus) return []

			const currentRoles = Array.isArray(field.state.value)
				? field.state.value
				: []
			const currentRolesLower = currentRoles.map((role) =>
				role.toLowerCase(),
			)

			return suggestions.filter(
				(suggestion) =>
					!currentRolesLower.includes(suggestion.toLowerCase()) &&
					suggestion.toLowerCase().includes(inputValue.toLowerCase()),
			)
		}, [inputValue, field.state.value, suggestions, showSuggestionsOnFocus])

		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					inputRef.current &&
					!inputRef.current.contains(event.target as Node) &&
					dropdownRef.current &&
					!dropdownRef.current.contains(event.target as Node)
				) {
					setIsFocused(false)
				}
			}

			document.addEventListener('mousedown', handleClickOutside)
			return () => {
				document.removeEventListener('mousedown', handleClickOutside)
			}
		}, [])

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(e.target.value)
			setDuplicateError(null)
		}

		const addRole = (role: string) => {
			const newRole = role.trim()
			if (!newRole) return

			const currentRoles = Array.isArray(field.state.value)
				? field.state.value
				: []

			if (
				currentRoles.some((r) => r.toLowerCase() === newRole.toLowerCase())
			) {
				setDuplicateError(duplicateErrorMessage)
				return
			}

			const newRoles = [...currentRoles, newRole]
			field.handleChange(newRoles)
			setInputValue('')
			setDuplicateError(null)
			clearFieldError(field.name)
		}

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter' && inputValue.trim()) {
				e.preventDefault()
				addRole(inputValue)
			}
		}

		const handleRemoveRole = (index: number, e: React.MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()

			const currentRoles = Array.isArray(field.state.value)
				? field.state.value
				: []
			const newRoles = currentRoles.filter((_, i) => i !== index)
			field.handleChange(newRoles)
		}

		const handleSuggestionClick = (
			suggestion: string,
			e: React.MouseEvent,
		) => {
			e.preventDefault()
			addRole(suggestion)

			if (inputRef.current) {
				inputRef.current.focus()
			}
		}

		const shouldShowDropdown =
			isFocused &&
			((Array.isArray(field.state.value) && field.state.value.length > 0) ||
				filteredSuggestions.length > 0)

		const errorMessage =
			field.state.meta.errors[0] ||
			error ||
			apiErrors[field.name] || duplicateError

		const dropdownThemeClass = darkMode
			? 'bg-gray-800 border-gray-700 text-white'
			: 'bg-white border-gray-300 text-gray-700'

		const dropdownItemHoverClass = darkMode
			? 'hover:bg-gray-700'
			: 'hover:bg-gray-100'

		//  const tagThemeClass = darkMode
		// ? 'bg-gray-700 text-gray-100'
		// : 'bg-blue-100 text-blue-800';

		const removeButtonThemeClass = darkMode
			? 'text-gray-300 hover:text-gray-100'
			: 'text-red-500 hover:text-red-700'

		const sectionHeaderClass = darkMode
			? 'bg-gray-900 text-gray-300 font-medium'
			: 'bg-gray-100 text-gray-600 font-medium'

		return (
			<div className="relative w-full">
				<Input
					type="text"
					ref={ref || inputRef}
					id={field.name}
					label={label}
					placeholder={placeholder}
					icon={prefix}
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onFocus={() => setIsFocused(true)}
					className={InputFieldClassName}
					error={errorMessage}
					darker={darkMode}
					{...props}
				/>

				{/* Combined dropdown with both current roles and suggestions */}
				{shouldShowDropdown && (
					<div
						ref={dropdownRef}
						className={`absolute z-10 w-full mt-1 border rounded shadow-lg max-h-60 overflow-y-auto ${dropdownThemeClass} ${dropdownClassName || ''}`}
						onMouseDown={(e) => e.preventDefault()}
					>
						{/* Current Roles Section */}
						{Array.isArray(field.state.value) &&
							field.state.value.length > 0 && (
								<div>
									<div className={`p-2 ${sectionHeaderClass}`}>
										Current Roles
									</div>
									{field.state.value.map((role, index) => (
										<div
											key={`role-${index}`}
											className={`p-2 flex justify-between items-center ${dropdownItemHoverClass}`}
										>
											<span>{role}</span>
											<button
												type="button"
												className={`${removeButtonThemeClass} ${removeButtonClassName || ''}`}
												onClick={(e) => handleRemoveRole(index, e)}
											>
												✕
											</button>
										</div>
									))}
								</div>
							)}

						{/* Suggestions Section */}
						{filteredSuggestions.length > 0 && (
							<div>
								<div className={`p-2 ${sectionHeaderClass}`}>
									Suggestions
								</div>
								{filteredSuggestions.map((suggestion, index) => (
									<div
										key={`suggestion-${index}`}
										className={`p-2 cursor-pointer ${dropdownItemHoverClass}`}
										onClick={(e) =>
											handleSuggestionClick(suggestion, e)
										}
									>
										{suggestion}
									</div>
								))}
							</div>
						)}
					</div>
				)}
				{/* List of current items (always visible as chips/tags) */}
				{/* {Array.isArray(field.state.value) && field.state.value.length > 0 && (*/}
				{/*  <div className={`mt-2 flex flex-wrap gap-2 ${tagsContainerClassName || ''}`}>*/}
				{/*    {field.state.value.map((role, index) => (*/}
				{/*      <div*/}
				{/*        key={`tag-${index}`}*/}
				{/*        className={`px-2 py-1 rounded-full flex items-center ${tagThemeClass} ${tagClassName || ''}`}*/}
				{/*      >*/}
				{/*        <span>{role}</span>*/}
				{/*        <button*/}
				{/*          type="button"*/}
				{/*          className={`ml-1 ${removeButtonThemeClass} ${removeButtonClassName || ''}`}*/}
				{/*          onClick={(e) => handleRemoveRole(index, e)}*/}
				{/*        >*/}
				{/*          ✕*/}
				{/*        </button>*/}
				{/*      </div>*/}
				{/*    ))}*/}
				{/*  </div>*/}
				{/* )}*/}
				{/* Custom error display - only show if Input doesn't handle it already */}
			</div>
		)
	},
)

export default RolesInputField
