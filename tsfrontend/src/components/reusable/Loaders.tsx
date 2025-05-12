import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type LoaderProps = {
	size?: number
	color?: string
	variant?: 'pulse' | 'spin' | 'dots' | 'bars' | 'wave' | 'bounce' | 'spiral'
	className?: string
	dynamicText?: boolean
	label?: string
	dotsInterval?: number
	sideBySide?: boolean
	labelSize?: 'sm' | 'md' | 'lg'
}

const Loader: React.FC<LoaderProps> = ({
	size = 20,
	color = '#3498db',
	variant = 'spin',
	className = '',
	dynamicText = false,
	label,
	dotsInterval = 500,
	sideBySide = true,
	labelSize = 'sm',
}) => {
	const [dots, setDots] = useState('.')

	useEffect(() => {
		if (!dynamicText || !label) return

		const interval = setInterval(() => {
			setDots((prev) => {
				if (prev.length >= 3) return '.'
				return prev + '.'
			})
		}, dotsInterval)

		return () => clearInterval(interval)
	}, [dynamicText, label, dotsInterval])

	const getLoader = () => {
		switch (variant) {
			case 'pulse':
				return <PulseLoader size={size} color={color} />
			case 'dots':
				return <DotsLoader size={size} color={color} />
			case 'bars':
				return <BarsLoader size={size} color={color} />
			case 'wave':
				return <WaveLoader size={size} color={color} />
			case 'bounce':
				return <BounceLoader size={size} color={color} />
			case 'spiral':
				return <SpiralLoader size={size} color={color} />
			default:
				return <SpinLoader size={size} color={color} />
		}
	}
	const getLabelSizeClass = () => {
		switch (labelSize) {
			case 'lg':
				return 'text-lg'
			case 'md':
				return 'text-md'
			default:
				return 'text-sm'
		}
	}

	return (
		<div
			className={`flex ${sideBySide ? 'flex-row items-center' : 'flex-col items-center'} justify-center ${className}`}
		>
			<div className={`${sideBySide ? 'mr-3' : ''}`}>{getLoader()}</div>
			<div className={`flex flex-col ${sideBySide ? '' : 'mt-2'}`}>
				{label && (
					<div className={`${getLabelSizeClass()} font-medium`}>
						{dynamicText ? `${label}${dots}` : label}
					</div>
				)}
			</div>
		</div>
	)
}

const SpinLoader: React.FC<{ size: number; color: string }> = ({
	size,
	color,
}) => {
	return (
		<motion.div
			style={{
				width: size,
				height: size,
				borderRadius: '50%',
				border: `${size / 10}px solid rgba(0, 0, 0, 0.1)`,
				borderTopColor: color,
				borderLeftColor: color,
			}}
			animate={{ rotate: 360 }}
			transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
		/>
	)
}

const PulseLoader: React.FC<{ size: number; color: string }> = ({
	size,
	color,
}) => {
	return (
		<motion.div
			style={{
				width: size,
				height: size,
				borderRadius: '50%',
				backgroundColor: color,
			}}
			animate={{
				scale: [1, 1.5, 1],
				opacity: [0.6, 0.3, 0.6],
			}}
			transition={{
				duration: 1.5,
				repeat: Infinity,
				ease: 'easeInOut',
			}}
		/>
	)
}

const DotsLoader: React.FC<{ size: number; color: string }> = ({
	size,
	color,
}) => {
	const dotSize = size / 4
	const containerSize = size
	const dotVariants = {
		animate: (i: number) => ({
			y: [0, -dotSize, 0],
			transition: {
				delay: i * 0.2,
				duration: 0.8,
				repeat: Infinity,
				ease: 'easeInOut',
			},
		}),
	}
	return (
		<div
			style={{
				width: containerSize,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			{[0, 1, 2].map((i) => (
				<motion.div
					key={i}
					custom={i}
					variants={dotVariants}
					animate="animate"
					style={{
						width: dotSize,
						height: dotSize,
						borderRadius: '50%',
						backgroundColor: color,
					}}
				/>
			))}
		</div>
	)
}

const BarsLoader: React.FC<{ size: number; color: string }> = ({
	size,
	color,
}) => {
	const barWidth = size / 6
	const containerWidth = size
	const containerHeight = size * 0.7
	const barVariants = {
		animate: (i: number) => ({
			scaleY: [0.4, 1, 0.4],
			transition: {
				delay: i * 0.1,
				duration: 1,
				repeat: Infinity,
				ease: 'easeInOut',
			},
		}),
	}
	return (
		<div
			style={{
				width: containerWidth,
				height: containerHeight,
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			{[0, 1, 2, 3].map((i) => (
				<motion.div
					key={i}
					custom={i}
					variants={barVariants}
					animate="animate"
					style={{
						width: barWidth,
						height: '100%',
						backgroundColor: color,
						borderRadius: barWidth / 2,
						transformOrigin: 'center bottom',
					}}
				/>
			))}
		</div>
	)
}

const WaveLoader: React.FC<{ size: number; color: string }> = ({
	size,
	color,
}) => {
	const circleSize = size / 8
	return (
		<div
			style={{
				width: size,
				height: circleSize * 2,
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			{[...Array(5)].map((_, index) => (
				<motion.div
					key={index}
					style={{
						width: circleSize,
						height: circleSize,
						borderRadius: '50%',
						backgroundColor: color,
						margin: '0 3px',
					}}
					animate={{
						y: [0, -size / 4, 0],
					}}
					transition={{
						duration: 0.8,
						repeat: Infinity,
						repeatType: 'loop',
						ease: 'easeInOut',
						delay: index * 0.1,
					}}
				/>
			))}
		</div>
	)
}

const BounceLoader: React.FC<{ size: number; color: string }> = ({
	size,
	color,
}) => {
	const ballSize = size / 3
	return (
		<div
			style={{
				width: size,
				height: size,
				position: 'relative',
				perspective: '500px',
			}}
		>
			<motion.div
				style={{
					width: ballSize,
					height: ballSize,
					borderRadius: '50%',
					backgroundColor: color,
					position: 'absolute',
					top: '50%',
					left: '50%',
					marginLeft: -ballSize / 2,
					marginTop: -ballSize / 2,
				}}
				animate={{
					y: [-size / 4, size / 4, -size / 4],
					scale: [1, 0.8, 1],
					boxShadow: [
						`0 ${size / 15}px ${size / 10}px rgba(0,0,0,0.2)`,
						`0 ${size / 30}px ${size / 20}px rgba(0,0,0,0.1)`,
						`0 ${size / 15}px ${size / 10}px rgba(0,0,0,0.2)`,
					],
				}}
				transition={{
					duration: 1,
					repeat: Infinity,
					repeatType: 'loop',
					ease: 'easeInOut',
				}}
			/>
			<motion.div
				style={{
					width: size,
					height: size / 20,
					borderRadius: '50%',
					backgroundColor: 'rgba(0,0,0,0.15)',
					position: 'absolute',
					bottom: 0,
					left: 0,
				}}
				animate={{
					scale: [1, 0.7, 1],
					opacity: [0.5, 0.7, 0.5],
				}}
				transition={{
					duration: 1,
					repeat: Infinity,
					repeatType: 'loop',
					ease: 'easeInOut',
				}}
			/>
		</div>
	)
}

const SpiralLoader: React.FC<{ size: number; color: string }> = ({
	size,
	color,
}) => {
	const numDots = 12
	const dotSize = size / 12
	const radius = size / 2.5
	return (
		<div
			style={{
				width: size,
				height: size,
				position: 'relative',
			}}
		>
			{Array.from({ length: numDots }).map((_, index) => {
				const angle = (index / numDots) * Math.PI * 2
				const x = Math.cos(angle) * radius
				const y = Math.sin(angle) * radius
				const scale = 0.5 + (0.5 * index) / numDots
				return (
					<motion.div
						key={index}
						style={{
							position: 'absolute',
							width: dotSize * scale,
							height: dotSize * scale,
							borderRadius: '50%',
							backgroundColor: color,
							top: '50%',
							left: '50%',
							x,
							y,
							margin: `-${(dotSize * scale) / 2}px 0 0 -${(dotSize * scale) / 2}px`,
						}}
						initial={{
							x,
							y,
							opacity: 0.3 + (0.7 * index) / numDots,
						}}
						animate={{
							scale: [1, 1.5, 1],
						}}
						transition={{
							duration: 1.2,
							repeat: Infinity,
							delay: (index / numDots) * 1.2,
							ease: 'easeInOut',
						}}
					/>
				)
			})}
		</div>
	)
}

export default Loader
