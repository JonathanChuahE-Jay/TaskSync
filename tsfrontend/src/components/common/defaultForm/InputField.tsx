import { IconUser } from '@tabler/icons-react'
import React from 'react'
import { useDefaultFieldContext } from './DefaultAppForm'
import Input from '@/components/reusable/Input'

interface InputFieldProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		'prefix' | 'value'
	> {
	label?: string
	darker?: boolean
	error?: string | undefined | null
	tooltip?: React.ReactNode
	prefix?: React.ReactNode
	InputFieldClassName?: string
	clearFieldError?: (fieldName: string) => void
	apiErrors?: Record<string, string | undefined>
	value?: string | number | ReadonlyArray<string> | undefined | boolean
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
	(
		{
			label = 'Username',
			error,
			tooltip,
			prefix = <IconUser className="size-5" />,
			InputFieldClassName,
			clearFieldError = () => {},
			apiErrors = {},
			...props
		},
		ref,
	) => {
		const field = useDefaultFieldContext<string | boolean>()

		return (
			<Input
				type={props.type || 'text'}
				ref={ref}
				id={field.name}
				label={label}
				placeholder={props.placeholder ?? 'Enter your username'}
				icon={prefix}
				value={field.state.value}
				checked={
					props.type === 'checkbox'
						? Boolean(field.state.value)
						: undefined
				}
				onChange={(e) => {
					if (props.type === 'checkbox') {
						field.handleChange(e.target.checked)
					} else {
						field.handleChange(e.target.value)
					}
					clearFieldError(field.name)
				}}
				error={field.state.meta.errors[0] || apiErrors[field.name] || error}
				className={InputFieldClassName}
				{...props}
			/>
		)
	},
)

export default InputField
