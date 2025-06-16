import { IconSelect } from '@tabler/icons-react'
import React from 'react'
import { useDefaultFieldContext } from './DefaultAppForm'
import Select from '@/components/reusable/Select'

interface SelectOption {
	value: string
	label: string
	prefix?: React.ReactNode
}

interface SelectFieldProps
	extends Omit<
		React.SelectHTMLAttributes<HTMLSelectElement>,
		'prefix' | 'value' | 'options'
	> {
	label?: string
	darker?: boolean
	error?: string | undefined | null
	tooltip?: React.ReactNode
	prefix?: React.ReactNode
	SelectFieldClassName?: string
	clearFieldError?: (fieldName: string) => void
	apiErrors?: Record<string, string | undefined>
	value?: string | undefined
	options: Array<SelectOption>
	placeholder?: string
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
	(
		{
			label = 'Select option',
			error,
			tooltip,
			prefix = <IconSelect className="size-5" />,
			SelectFieldClassName,
			clearFieldError = () => {},
			apiErrors = {},
			options = [],
			placeholder = 'Select an option',
			...props
		},
		ref,
	) => {
		const field = useDefaultFieldContext<string>()


		return (
			<Select
				ref={ref}
				id={field.name}
				label={label}
				placeholder={placeholder}
				icon={prefix}
				value={field.state.value}
				onChange={(e) => {
					field.handleChange(e.target.value)
					clearFieldError(field.name)
				}}
				error={field.state.meta.errors[0] || apiErrors[field.name] || error}
				className={SelectFieldClassName}
				options={options}
				{...props}
			/>
		)
	},
)

export default SelectField
