const RegisterOtpHelper = () => {
	return (
		<div className="mt-6 w-full max-w-md">
			<div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
				<h4 className="text-sm font-medium text-blue-700 mb-2">
					Didn't receive the code?
				</h4>
				<ul className="text-xs text-blue-600 space-y-1.5">
					<li className="flex items-start">
						<span className="inline-block h-4 w-4 mr-1.5 flex-shrink-0">
							•
						</span>
						<span>
							Check that your phone number was entered correctly
						</span>
					</li>
					<li className="flex items-start">
						<span className="inline-block h-4 w-4 mr-1.5 flex-shrink-0">
							•
						</span>
						<span>Try resending the code after 60 seconds</span>
					</li>
					<li className="flex items-start">
						<span className="inline-block h-4 w-4 mr-1.5 flex-shrink-0">
							•
						</span>
						<span>Contact support if you continue having issues</span>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default RegisterOtpHelper
