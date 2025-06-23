import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { SubmitButton } from '@/components/common/defaultForm/SubmitButton.tsx'
import InputField from '@/components/common/defaultForm/InputField.tsx'
import SelectField from '@/components/common/defaultForm/SelectField.tsx'
import TextareaField from '@/components/common/defaultForm/TextareaField.tsx'
import TagInputField from '@/components/common/defaultForm/TagInputField.tsx'
import RadioField from '@/components/common/defaultForm/RadioField.tsx'
import RolesInputField from '@/components/common/defaultForm/RolesInputField.tsx'


export const {
	fieldContext: defaultFieldContext,
	formContext: defaultFormContext,
	useFieldContext: useDefaultFieldContext,
	useFormContext: useDefaultFormContext,
} = createFormHookContexts()

export const { useAppForm: useDefaultAppForm, withForm: defaultWithForm } =
	createFormHook({
		fieldContext: defaultFieldContext,
		formContext: defaultFormContext,
		fieldComponents: {
			InputField,
			SelectField,
			TextareaField,
			TagInputField,
			RadioField,
			RolesInputField
		},
		formComponents: {
			SubmitButton,
		},
	})
