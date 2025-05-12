import type { Dispatch, SetStateAction } from 'react'
import type { ErrorResponse } from '@/types/errorResponse.ts'
import OtpInput from '@/components/reusable/OtpInput.tsx'
import RegisterOtpHelper from '@/components/auth/register/stepSections/registerOtp/RegisterOTPHelper.tsx'
import RegisterResetOtp from '@/components/auth/register/stepSections/registerOtp/RegisterResetOTP.tsx'
import RegisterOtpSentText from '@/components/auth/register/stepSections/registerOtp/RegisterOTPSentText.tsx'

const RegisterOtp = ({
	form,
	otpValue,
	setOtpValue,
	isLoading,
	handleResendOtp,
	apiErrors,
}: {
	form: any
	otpValue: string
	setOtpValue: Dispatch<SetStateAction<string>>
	isLoading: boolean
	handleResendOtp: () => void
	apiErrors: ErrorResponse
}) => {
	return (
		<div className="space-y-5">
			<div className="flex flex-col items-center">
				<div className="w-full max-w-md  backdrop-blur-sm rounded-xl p-6 shadow-sm border ">
					<RegisterOtpSentText form={form} />
					<div className="mb-5">
						<OtpInput
							length={6}
							value={otpValue}
							onChange={setOtpValue}
							error={apiErrors.otp}
							isLoading={isLoading}
							autoFocus={true}
						/>
					</div>

					<RegisterResetOtp
						handleResendOtp={handleResendOtp}
						isLoading={isLoading}
					/>
				</div>

				<RegisterOtpHelper />
			</div>
		</div>
	)
}

export default RegisterOtp
