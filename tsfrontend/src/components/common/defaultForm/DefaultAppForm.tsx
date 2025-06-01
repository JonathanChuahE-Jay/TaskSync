import {createFormHook, createFormHookContexts} from '@tanstack/react-form'
import { SubmitButton } from '@/components/common/defaultForm/SubmitButton.tsx'
import InputField from '@/components/common/defaultForm/InputField.tsx'

export const {
	fieldContext: defaultFieldContext,
	formContext: defaultFormContext,
	useFieldContext: useDefaultFieldContext,
	useFormContext: useDefaultFormContext,
} = createFormHookContexts()


export const {
	useAppForm: useDefaultAppForm,
	withForm: defaultWithForm
} = createFormHook({
	fieldContext: defaultFieldContext,
	formContext: defaultFormContext,
	fieldComponents: {
		InputField
	},
	formComponents: {
		SubmitButton
	},
})

