import { useEffect, useMemo, useState } from 'react'

interface StarryNightProps {
	starCount?: number
	meteorCount?: number
	meteorDuration?: number
}

const StarryNight = ({
	starCount = 100,
	meteorCount = 10,
}: StarryNightProps) => {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
	const [meteors, setMeteors] = useState<
		Array<{ id: number; delay: number; duration: number }>
	>([])

	useEffect(() => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		})
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			})
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useEffect(() => {
		const initialMeteors = Array.from({ length: meteorCount }, (_, i) => ({
			id: i,
			delay: Math.random() * 15,
			duration: 4 + Math.random() * 20,
		}))
		setMeteors(initialMeteors)
		const intervalId = setInterval(() => {
			setMeteors((prev) =>
				prev.map((meteor) => ({
					...meteor,
					delay: Math.random() * 15,
				})),
			)
		}, 50000)
		return () => clearInterval(intervalId)
	}, [meteorCount])

	const starColors = [
		'white',
		'rgba(173, 216, 230, 0.8)',
		'rgba(255, 223, 186, 0.8)',
		'rgba(255, 255, 186, 0.8)',
		'rgba(186, 255, 255, 0.8)',
	]

	const brightStarColors = [
		'rgba(255, 255, 255, 1)',
		'rgba(200, 230, 255, 1)',
		'rgba(255, 240, 200, 1)',
		'rgba(230, 255, 250, 1)',
	]

	const generateRandomStars = (count: number, includeBright = false) => {
		let boxShadow = ''
		for (let i = 0; i < count; i++) {
			const x = Math.random() * 100 // Random x position (vw)
			const y = Math.random() * 100 // Random y position (vh)
			// Determine if this star should be bright or regular
			const isBright = includeBright && Math.random() < 0.15 // 15% of stars are bright
			const size = isBright
				? Math.random() * 1.5 + 1.5 // Bright stars: 1.5-3px
				: Math.random() < 0.7
					? 1
					: 1.5 // Regular stars: 70% small (1px), 30% medium (1.5px)
			const colorArray = isBright ? brightStarColors : starColors
			const color = colorArray[Math.floor(Math.random() * colorArray.length)]
			boxShadow += `${x}vw ${y}vh ${size}px ${color}${i < count - 1 ? ', ' : ''}`
		}
		return boxShadow
	}

	const mainStars = useMemo(
		() => generateRandomStars(starCount, true),
		[starCount],
	)

	const secondaryStars = useMemo(
		() => generateRandomStars(Math.floor(starCount * 0.8)),
		[starCount],
	)

	const generateShootingStarsColors = (count = 5) => {
		const colors = []
		for (let i = 0; i < count; i++) {
			const r = Math.floor(200 + Math.random() * 55)
			const g = Math.floor(Math.random() * 255)
			const b = Math.floor(Math.random() * 255)
			const a = 0.8
			colors.push(`rgba(${r},${g},${b},${a})`)
		}
		return colors
	}

	const shootingStarsColors = generateShootingStarsColors(meteorCount)

	if (windowSize.width === 0) {
		return null
	}

	return (
		<div className="fixed inset-0 overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-b from-[#0b0b2b] via-[#1b2735] to-[#090a0f] -z-10"></div>
			<div
				className="absolute w-px h-px bg-white animate-twinkle"
				style={{
					boxShadow: mainStars,
				}}
			></div>
			<div
				className="absolute w-px h-px bg-white animate-twinkle-reverse"
				style={{
					boxShadow: secondaryStars,
				}}
			></div>
			{meteors.map((meteor) => (
				<div
					key={meteor.id}
					className="absolute h-0 w-0 rounded-full bg-white"
					style={{
						top: `${Math.random() * 100}vh`,
						left: `${Math.random() * 100}vw`,
						boxShadow:
							'0 0 0 1px #ffffff10, 0 0 0 2px #ffffff08, 0 0 20px #fff',
						opacity: 0,
						animationDelay: `${meteor.delay}s`,
						animationDuration: `${meteor.duration}s`,
						animationTimingFunction: 'linear',
						animationName: 'meteor',
						animationIterationCount: 'infinite',
					}}
				>
					<div
						className="w-20 h-0.5 -ml-2"
						style={{
							background: `linear-gradient(90deg, ${shootingStarsColors[meteor.id % shootingStarsColors.length]}, transparent)`,
							transform: 'rotate(-45deg)',
							transformOrigin: 'left center',
							borderRadius: '999px',
						}}
					/>
				</div>
			))}
		</div>
	)
}

export default StarryNight
