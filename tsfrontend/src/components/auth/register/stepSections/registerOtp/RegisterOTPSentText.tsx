import { IconPhone } from '@tabler/icons-react'

const RegisterOtpSentText = ({ form }: { form: any }) => {
	return (
		<div className="text-center mb-6">
			<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
				<IconPhone className="h-8 w-8 text-blue-600" stroke={1.5} />
			</div>
			<h3 className="text-lg font-semibold text-gray-800">
				Phone Verification
			</h3>
			<p className="text-sm text-gray-600 mt-1">
				We've sent a 6-digit code to
			</p>
			<p className="text-sm font-medium text-gray-800 mt-1">
				{form.getFieldValue('phone_number')}
			</p>
		</div>
	)
}

export default RegisterOtpSentText
