import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { ClipboardEvent, KeyboardEvent } from 'react'

interface OtpInputProps {
	length: number
	value: string
	onChange: (otp: string) => void
	error?: string
	isLoading?: boolean
	label?: string
	autoFocus?: boolean
}

const OtpInput: React.FC<OtpInputProps> = ({
	length,
	value,
	onChange,
	error,
	isLoading = false,
	label = 'Verification Code',
	autoFocus = true,
}) => {
	const inputRefs = useRef<Array<HTMLInputElement | null>>([])
	const [activeIndex, setActiveIndex] = useState(0)

	useEffect(() => {
		inputRefs.current = inputRefs.current.slice(0, length)
		if (autoFocus && inputRefs.current[0]) {
			inputRefs.current[0].focus()
		}
	}, [length, autoFocus])

	useEffect(() => {
		const otpArray = value.split('')
		inputRefs.current.forEach((input, index) => {
			if (input) {
				input.value = otpArray[index] || ''
			}
		})
	}, [value])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => {
		const val = e.target.value

		if (val.length > 1) {
			const digits = val.split('')
			if (digits.length > 1) {
				const combinedOtp = [...value.split('')]
				let nextFocusIndex = index
				for (let i = 0; i < digits.length && index + i < length; i++) {
					if (/^\d$/.test(digits[i])) {
						combinedOtp[index + i] = digits[i]
						nextFocusIndex = Math.min(index + i + 1, length - 1)
					}
				}
				onChange(combinedOtp.join('').slice(0, length))
				if (nextFocusIndex < length) {
					setTimeout(() => {
						inputRefs.current[nextFocusIndex]?.focus()
						setActiveIndex(nextFocusIndex)
					}, 0)
				}
				return
			}
			e.target.value = val.charAt(0)
		}

		if (!/^\d*$/.test(e.target.value)) {
			e.target.value = ''
			return
		}

		const newOtp = [...value.split('')]
		newOtp[index] = e.target.value
		onChange(newOtp.join(''))

		if (e.target.value !== '' && index < length - 1) {
			inputRefs.current[index + 1]?.focus()
			setActiveIndex(index + 1)
		}
	}

	const handleKeyDown = (
		e: KeyboardEvent<HTMLInputElement>,
		index: number,
	) => {
		if (e.key === 'Backspace') {
			if (inputRefs.current[index]?.value === '') {
				if (index > 0) {
					inputRefs.current[index - 1]?.focus()
					inputRefs.current[index - 1]?.select()
					setActiveIndex(index - 1)
				}
			} else {
				const newOtp = [...value.split('')]
				newOtp[index] = ''
				onChange(newOtp.join(''))
			}
		} else if (e.key === 'ArrowLeft' && index > 0) {
			inputRefs.current[index - 1]?.focus()
			setActiveIndex(index - 1)
		} else if (e.key === 'ArrowRight' && index < length - 1) {
			inputRefs.current[index + 1]?.focus()
			setActiveIndex(index + 1)
		}
	}

	const handleFocus = (index: number) => {
		setActiveIndex(index)
		if (inputRefs.current[index]) {
			inputRefs.current[index]?.select()
		}
	}

	const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
		e.preventDefault()
		const pastedData = e.clipboardData.getData('text/plain').trim()
		if (!/^\d*$/.test(pastedData)) return

		const pastedChars = pastedData.split('')
		const newOtp = [...value.split('')]
		let focusIndex = index

		for (let i = 0; i < pastedChars.length && index + i < length; i++) {
			newOtp[index + i] = pastedChars[i]
			focusIndex = index + i
		}

		onChange(newOtp.join(''))

		const nextIndex = Math.min(focusIndex + 1, length - 1)
		setTimeout(() => {
			inputRefs.current[nextIndex]?.focus()
			setActiveIndex(nextIndex)
		}, 0)
	}

	return (
		<div className="w-full">
			{label && (
				<label className="block text-gray-700 mb-2 font-medium">
					{label}
				</label>
			)}
			<div className="flex justify-center gap-2 mb-1">
				{Array.from({ length }, (_, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2, delay: index * 0.05 }}
						className="relative"
					>
						<input
							ref={(el) => {
								inputRefs.current[index] = el
							}}
							type="text"
							maxLength={1}
							className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 text-black
               ${activeIndex === index ? 'border-blue-500 shadow-sm shadow-blue-200' : 'border-gray-200'}
               ${error ? 'border-red-500' : ''}
               ${isLoading ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-white'} focus:outline-none focus:border-blue-500 transition-all duration-150`}
							onChange={(e) => handleChange(e, index)}
							onKeyDown={(e) => handleKeyDown(e, index)}
							onPaste={(e) => handlePaste(e, index)}
							onFocus={() => handleFocus(index)}
							onClick={() => handleFocus(index)}
							disabled={isLoading}
							inputMode="numeric"
							autoComplete="one-time-code"
						/>
					</motion.div>
				))}
			</div>
			{error && (
				<motion.p
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-red-500 text-sm mt-1"
				>
					{error}
				</motion.p>
			)}
		</div>
	)
}

export default OtpInput
