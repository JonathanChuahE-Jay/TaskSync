import {useDefaultFormContext} from "./DefaultAppForm.tsx";


export function SubmitButton({label, loadingLabel}: { label: string, loadingLabel: string }) {
	const form = useDefaultFormContext()

	return (
		<form.Subscribe>
			{({isSubmitting}) => (
				<button
					className="mt-8"
					type="submit"
					disabled={isSubmitting}
				>
					{!isSubmitting ? label: `${loadingLabel}...`}
				</button>
			)}
		</form.Subscribe>
	)

}