import { useEffect, useState } from 'react'

interface ValidationState {
	hasUpperCase: boolean;
	hasNumber: boolean;
	hasMinLength: boolean;
	isValid: boolean;
	hasSamePassword: boolean;
}

export const usePasswordValidation = (password: string, confirmPassword: string) => {
	const [validations, setValidations] = useState<ValidationState>({
		hasUpperCase: false,
		hasNumber: false,
		hasMinLength: false,
		hasSamePassword: false,
		isValid: false,
	})

	useEffect(() => {
		const hasUpperCase = /[A-Z]/.test(password)
		const hasNumber = /\d/.test(password)
		const hasMinLength = password.length >= 8
		const hasSamePassword = (password === confirmPassword) && (confirmPassword === password)
		const isValid = hasUpperCase && hasNumber && hasMinLength

		setValidations({
			hasUpperCase,
			hasNumber,
			hasMinLength,
			hasSamePassword,
			isValid,
		})
	}, [password, confirmPassword])

	return validations
}
