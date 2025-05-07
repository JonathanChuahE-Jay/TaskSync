import { IconRepeat } from '@tabler/icons-react'

const RegisterResetOtp = ({
	handleResendOtp,
	isLoading,
}: {
	handleResendOtp: () => void
	isLoading: boolean
}) => {
	return (
		<div className="flex items-center justify-center">
			<div className="text-center">
				<button
					type="button"
					onClick={handleResendOtp}
					disabled={isLoading}
					className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 text-sm font-medium transition-colors flex items-center gap-1"
				>
					<IconRepeat className="size-4" />
					Resend Code
				</button>
				{isLoading && (
					<p className="text-xs text-gray-500 mt-2">Please wait...</p>
				)}
			</div>
		</div>
	)
}

export default RegisterResetOtp
