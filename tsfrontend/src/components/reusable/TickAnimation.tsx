import { useEffect, useState } from 'react'

export default function TickAnimation() {
	const [animate, setAnimate] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimate(true)
		}, 100)

		return () => clearTimeout(timer)
	}, [])

	return (
		<div className="flex items-center justify-center">
			<div className="relative h-24 w-24">
				<svg
					className="h-full w-full"
					viewBox="0 0 100 100"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						cx="50"
						cy="50"
						r="45"
						stroke="#4ade80"
						strokeWidth="6"
						fill="transparent"
						style={{
							strokeDasharray: '283',
							strokeDashoffset: animate ? '0' : '283',
							transition: 'stroke-dashoffset 1s ease-out',
						}}
					/>

					<polyline
						points="30,50 45,65 70,35"
						stroke="#4ade80"
						strokeWidth="6"
						strokeLinecap="round"
						strokeLinejoin="round"
						fill="none"
						style={{
							opacity: animate ? 1 : 0,
							transition: 'opacity 0.5s ease-in-out',
							transitionDelay: animate ? '0.8s' : '0s',
						}}
					/>
				</svg>
			</div>
		</div>
	)
}
