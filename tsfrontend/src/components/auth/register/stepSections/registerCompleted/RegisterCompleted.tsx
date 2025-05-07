import TickAnimation from '@/components/reusable/TickAnimation.tsx'

const RegisterCompleted = () => {
	return (
		<div className="space-y-5">
			<div className="py-4 text-center">
				<TickAnimation />
				<h3 className="text-xl font-medium text-cyan-200 mt-5">
					Registration Successful!
				</h3>
				<p className="text-indigo-200 mt-2">
					Your account has been created. You will be redirected to the
					login page shortly.
				</p>
			</div>
		</div>
	)
}

export default RegisterCompleted
