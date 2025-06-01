import { formOptions } from '@tanstack/form-core'
import { Role } from '@/types/user.ts'

export const registerFormHelper = formOptions({
   defaultValues: {
			username: '',
			first_name: '',
			last_name: '',
			email: '',
			password: '',
			password2: '',
			phone_number: '',
			role: Role.MEMBER,
			agreeToTerms: false,
		},
})