import React from 'react'
import { IconCheck, IconX } from '@tabler/icons-react'

interface ValidationState {
	hasUpperCase: boolean
	hasNumber: boolean
	hasMinLength: boolean
	hasSamePassword: boolean
	isValid: boolean
}

interface PasswordValidationFeedbackProps {
	validations: ValidationState
}

const PasswordValidationFeedback: React.FC<PasswordValidationFeedbackProps> = ({
	validations,
}) => {
	return (
		<div className="text-sm space-y-1">
			<div className="flex items-center gap-1">
				{validations.hasMinLength ? (
					<IconCheck className="text-green-500 size-4" />
				) : (
					<IconX className="text-red-500 size-4" />
				)}
				<span>Minimum 8 characters</span>
			</div>
			<div className="flex items-center gap-1">
				{validations.hasUpperCase ? (
					<IconCheck className="text-green-500 size-4" />
				) : (
					<IconX className="text-red-500 size-4" />
				)}
				<span>At least one uppercase letter</span>
			</div>
			<div className="flex items-center gap-1">
				{validations.hasNumber ? (
					<IconCheck className="text-green-500 size-4" />
				) : (
					<IconX className="text-red-500 size-4" />
				)}
				<span>At least one number</span>
			</div>
			<div className="flex items-center gap-1">
				{validations.hasSamePassword ? (
					<IconCheck className="text-green-500 size-4" />
				) : (
					<IconX className="text-red-500 size-4" />
				)}
				<span>Passwords match</span>
			</div>
		</div>
	)
}

export default PasswordValidationFeedback
