import React from 'react'
import { useDefaultFieldContext } from './DefaultAppForm'
import Textarea from '@/components/reusable/Textarea'
import { IconFileText } from '@tabler/icons-react'

interface TextareaFieldProps
	extends Omit<
		React.TextareaHTMLAttributes<HTMLTextAreaElement>,
		'prefix' | 'value'
	> {
	label?: string
	darker?: boolean
	error?: string | undefined | null
	tooltip?: React.ReactNode
	prefix?: React.ReactNode
	TextareaFieldClassName?: string
	clearFieldError?: (fieldName: string) => void
	apiErrors?: Record<string, string | undefined>
	value?: string | undefined
	rows?: number
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
	(
		{
			label = 'Description',
			error,
			tooltip,
			prefix = <IconFileText className="size-5" />,
			TextareaFieldClassName,
			clearFieldError = () => {},
			apiErrors = {},
			rows = 4,
			...props
		},
		ref,
	) => {
		const field = useDefaultFieldContext<string>()

		return (
			<Textarea
				ref={ref}
				id={field.name}
				label={label}
				placeholder={props.placeholder ?? 'Enter description'}
				icon={prefix}
				value={field.state.value}
				onChange={(e) => {
					field.handleChange(e.target.value)
					clearFieldError(field.name)
				}}
				error={field.state.meta.errors[0] || apiErrors[field.name] || error}
				className={TextareaFieldClassName}
				rows={rows}
				{...props}
			/>
		)
	},
)

export default TextareaField
