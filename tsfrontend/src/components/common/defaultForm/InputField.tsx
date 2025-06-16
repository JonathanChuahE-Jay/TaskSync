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
	error?: string | undefined
	tooltip?: React.ReactNode
	prefix?: React.ReactNode
	InputFieldClassName?: string
	clearFieldError?: (fieldName: string) => void
	apiErrors?: Record<string, string | undefined>
	value?: string | number | ReadonlyArray<string> | undefined | boolean
	maxFiles?: number
	maxFileSize?: number
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
			maxFiles = 0,
			maxFileSize = 0,
			...props
		},
		ref,
	) => {
		const field = useDefaultFieldContext<string | boolean | Array<File>>()
		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (props.type === 'checkbox') {
				field.handleChange(e.target.checked)
			} else if (props.type === 'color') {
				field.handleChange(e.target.value)
			} else if (props.type === 'file') {
				if (e.target.files && e.target.files.length > 0) {
					const files = Array.from(e.target.files)
					field.handleChange(files)
				}
			} else {
				field.handleChange(e.target.value)
			}
			clearFieldError(field.name)
		}
		const handleFileChange = (files: Array<File>) => {
			field.handleChange(files)
			clearFieldError(field.name)
		}
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
				onChange={handleInputChange}
				onFileChange={props.type === 'file' ? handleFileChange : undefined}
				className={InputFieldClassName}
				multiple={props.multiple}
				accept={props.accept}
				maxFiles={maxFiles}
				maxFileSize={maxFileSize}
				error={error}
				{...props}
			/>
		)
	},
)

export default InputField
