import { IconBrandApple, IconBrandGoogle } from '@tabler/icons-react'

const LoginSocialMedia = () => {
	return (
		<div className="mt-4 flex space-x-3">
			<button
				type="button"
				className="flex-1 flex justify-center items-center gap-2 bg-white border border-slate-200 py-2.5 rounded-lg
                  hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
			>
				<IconBrandGoogle size={20} className="text-[#4285F4]" />
				<span className="text-slate-700 text-sm font-medium">Google</span>
			</button>
			<button
				type="button"
				className="flex-1 flex justify-center items-center gap-2 bg-white border border-slate-200 py-2.5 rounded-lg
                  hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
			>
				<IconBrandApple size={20} className="text-black"/>
				<span className="text-slate-700 text-sm font-medium">Apple</span>
			</button>
		</div>
	)
}

export default LoginSocialMedia
