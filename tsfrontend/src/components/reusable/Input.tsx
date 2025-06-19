import React, { useEffect, useRef, useState } from 'react'
import {
	IconAlertCircle,
	IconDownload,
	IconEye,
	IconEyeOff,
	IconFile,
	IconTrash,
	IconUpload,
	IconX,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/utils'

type InputProps = {
	label?: string
	type: string
	placeholder?: string
	icon?: React.ReactNode
	value: string | number | ReadonlyArray<string> | boolean | Array<File>
	checked?: boolean
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onFileChange?: (files: Array<File>) => void
	error?: string
	id?: string
	required?: boolean
	disabled?: boolean
	ref?: React.Ref<HTMLInputElement>
	className?: string
	showClearButton?: boolean
	accept?: string
	multiple?: boolean
	maxHeight?: string | number
	maxFiles?: number
	maxFileSize?: number
}

const formatFileSize = (bytes: number) => {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const Input: React.FC<InputProps> = ({
	label,
	type,
	placeholder,
	icon,
	value,
	checked,
	onChange,
	onFileChange,
	error,
	id,
	className,
	disabled = false,
	required = false,
	showClearButton = false,
	accept,
	multiple = false,
	maxHeight = '300px',
	maxFiles = 0, // 0 means unlimited
	maxFileSize = 0, // 0 means unlimited
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [fileError, setFileError] = useState<string | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [fileCount, setFileCount] = useState(0)
	const [remainingFileCount, setRemainingFileCount] = useState<number | null>(
		null,
	)

	const inputType = type === 'password' && showPassword ? 'text' : type
	const shouldShowClearButton =
		showClearButton &&
		typeof value === 'string' &&
		value.length > 0 &&
		type !== 'password' &&
		!disabled

	// Update file counts whenever value changes
	useEffect(() => {
		if (Array.isArray(value)) {
			setFileCount(value.length)
			if (maxFiles > 0) {
				setRemainingFileCount(maxFiles - value.length)
			} else {
				setRemainingFileCount(null)
			}
		}
	}, [value, maxFiles])

	const handleClear = () => {
		const syntheticEvent = {
			target: { value: '' },
		} as React.ChangeEvent<HTMLInputElement>
		onChange(syntheticEvent)
	}

	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		} else {
			const fileInput = document.getElementById(id || '') as HTMLInputElement
			fileInput.click()
		}
	}

	const validateFiles = (files: Array<File>) => {
		setFileError(null)

		const currentFiles = Array.isArray(value) ? value.length : 0

		if (maxFiles > 0) {
			if (currentFiles + files.length > maxFiles) {
				const errorMsg = `You can upload a maximum of ${maxFiles} files (${currentFiles} already uploaded)`
				console.log('Setting file error:', errorMsg)
				setFileError(errorMsg)
				return false
			}
		}

		if (maxFileSize > 0) {
			const oversizedFiles = files.filter((file) => file.size > maxFileSize)
			if (oversizedFiles.length > 0) {
				const errorMsg = `File size exceeds the limit of ${formatFileSize(maxFileSize)}`
				console.log('Setting file error:', errorMsg)
				setFileError(errorMsg)
				return false
			}
		}

		return true
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files)

			if (!validateFiles(newFiles)) {
				if (fileInputRef.current) fileInputRef.current.value = ''
				return
			}

			if (Array.isArray(value) && multiple) {
				const updatedFiles = [...value, ...newFiles]

				if (onFileChange) {
					console.log(
						'Calling onFileChange with',
						updatedFiles.length,
						'files',
					)
					onFileChange(updatedFiles)
				} else {
					const syntheticEvent = {
						target: {
							files: e.target.files,
							value: e.target.files[0].name,
						},
					} as unknown as React.ChangeEvent<HTMLInputElement>
					onChange(syntheticEvent)
				}
			} else {
				if (onFileChange) {
					console.log(
						'Calling onFileChange with',
						newFiles.length,
						'files',
					)
					onFileChange(newFiles)
				} else {
					onChange(e)
				}
			}

			if (fileInputRef.current) fileInputRef.current.value = ''
		}
	}

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		if (!disabled) setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)

		if (disabled) return

		if (e.dataTransfer.files.length > 0) {
			const newFiles = Array.from(e.dataTransfer.files)

			if (!validateFiles(newFiles)) {
				return
			}

			if (Array.isArray(value) && multiple) {
				const updatedFiles = [...value, ...newFiles]

				if (onFileChange) {
					console.log(
						'Drop: Calling onFileChange with',
						updatedFiles.length,
						'files',
					)
					onFileChange(updatedFiles)
				} else {
					const syntheticEvent = {
						target: {
							files: e.dataTransfer.files,
							value: e.dataTransfer.files[0].name,
						},
					} as unknown as React.ChangeEvent<HTMLInputElement>
					onChange(syntheticEvent)
				}
			} else {
				if (onFileChange) {
					console.log(
						'Drop: Calling onFileChange with',
						newFiles.length,
						'files',
					)
					onFileChange(newFiles)
				} else {
					const syntheticEvent = {
						target: {
							files: e.dataTransfer.files,
							value: e.dataTransfer.files[0].name,
						},
					} as unknown as React.ChangeEvent<HTMLInputElement>
					onChange(syntheticEvent)
				}
			}

			if (fileInputRef.current) fileInputRef.current.value = ''
		}
	}

	const removeFile = (fileIndex: number, e: React.MouseEvent) => {
		e.stopPropagation()

		if (Array.isArray(value)) {
			const newFiles = [...value]
			newFiles.splice(fileIndex, 1)

			if (onFileChange) {
				console.log(
					'Remove: Calling onFileChange with',
					newFiles.length,
					'files',
				)
				onFileChange(newFiles)

				if (
					maxFiles > 0 &&
					fileCount > maxFiles &&
					newFiles.length <= maxFiles
				) {
					setFileError(null)
				}
			}
		}
	}

	if (type === 'checkbox') {
		return (
			<div className="flex items-center">
				<input
					disabled={disabled}
					id={id}
					type="checkbox"
					checked={checked}
					onChange={onChange}
					className={cn(
						'h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500',
						className,
					)}
				/>
				{label && (
					<label
						htmlFor={id}
						className="ml-2 block text-sm text-slate cursor-pointer"
					>
						{label}
					</label>
				)}
			</div>
		)
	}

	if (type === 'color') {
		const currentColor = typeof value === 'string' ? value : '#000000'
		return (
			<div className="relative w-full">
				{label && (
					<label
						htmlFor={id}
						className="block text-sm font-medium text-slate mb-1.5 pointer-events-none"
					>
						{label} {required && <span className="text-rose-500">*</span>}
					</label>
				)}
				<div className="flex flex-col gap-3 w-full">
					<div className="flex items-center gap-3 w-full">
						{icon && <span>{icon}</span>}
						<div className="flex items-center justify-between w-full gap-3">
							<motion.div
								whileHover={{ scale: 1.03 }}
								className="relative h-10 w-full overflow-hidden rounded-md border border-gray-300"
							>
								<input
									id={id}
									type="color"
									disabled={disabled}
									className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
									value={currentColor}
									onChange={onChange}
									{...props}
								/>
								<div
									className="h-full w-full flex items-center justify-center"
									style={{ backgroundColor: currentColor }}
								>
									<input
										type="text"
										value={currentColor}
										onChange={(e) => {
											const newColor = e.target.value
											if (
												/^#([0-9A-Fa-f]{3}){1,2}$/.test(newColor)
											) {
												const syntheticEvent = {
													target: { value: newColor },
												} as React.ChangeEvent<HTMLInputElement>
												onChange(syntheticEvent)
											}
										}}
										className="bg-transparent text-sm font-mono text-white text-center w-24 outline-none border-none"
										style={{
											textShadow:
												'0 0 2px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.8)',
										}}
									/>
								</div>
							</motion.div>
						</div>
					</div>
				</div>
				{error && (
					<p className="mt-1 text-sm text-rose-500 flex items-center">
						<IconAlertCircle className="size-4 mr-1" stroke={1.5} />
						{error}
					</p>
				)}
			</div>
		)
	}

	if (type === 'file') {
		const fileInputId =
			id || `file-input-${Math.random().toString(36).substr(2, 9)}`
		const totalSize = Array.isArray(value)
			? value.reduce((sum, file) => sum + file.size, 0)
			: 0

		const displayFileCount = fileCount
		const displayRemainingFiles = remainingFileCount
		const hasReachedMaxFiles = maxFiles > 0 && displayFileCount >= maxFiles

		return (
			<div className="relative">
				{label && (
					<label
						htmlFor={fileInputId}
						className="block text-sm font-medium text-slate mb-1.5 pointer-events-none"
					>
						{label} {required && <span className="text-rose-500">*</span>}
					</label>
				)}
				<input
					ref={fileInputRef}
					id={fileInputId}
					name={fileInputId}
					type="file"
					accept={accept}
					multiple={multiple}
					disabled={disabled || hasReachedMaxFiles}
					className="hidden"
					onChange={handleFileChange}
					{...props}
				/>
				<div
					className={cn(
						'relative border-2 border-dashed rounded-lg p-4 transition-colors',
						disabled || hasReachedMaxFiles
							? 'opacity-60 cursor-not-allowed border-gray-300 bg-gray-50'
							: isDragging
								? 'border-blue-400 bg-blue-50 cursor-pointer'
								: 'border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer',
					)}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onClick={() => {
						if (!disabled && !hasReachedMaxFiles) {
							triggerFileInput()
						}
					}}
				>
					<div className="flex flex-col items-center justify-center py-3">
						<IconUpload
							className={cn(
								'size-8 mb-2',
								isDragging ? 'text-blue-500' : 'text-gray-400',
								hasReachedMaxFiles && 'text-gray-300',
							)}
							stroke={1.5}
						/>
						<p className="text-sm font-medium text-gray-700">
							{isDragging
								? 'Drop files here'
								: hasReachedMaxFiles
									? `Maximum file limit reached (${maxFiles})`
									: 'Drag and drop files here'}
						</p>
						{!hasReachedMaxFiles && (
							<p className="mt-1 text-xs text-gray-500">
								or{' '}
								<button
									className="text-blue-500 hover:underline focus:outline-none"
									type="button"
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										triggerFileInput()
									}}
									disabled={disabled}
								>
									browse
								</button>{' '}
								to choose files {multiple && '(multiple files allowed)'}
							</p>
						)}
						{accept && (
							<p className="mt-1 text-xs text-gray-500">
								Accepted formats: {accept}
							</p>
						)}
						<div className="flex flex-col items-center mt-2 text-xs text-gray-500">
							{maxFiles > 0 && (
								<p>
									File limit: {displayFileCount}/{maxFiles}
									{displayRemainingFiles !== null &&
										displayRemainingFiles > 0 &&
										` (${displayRemainingFiles} remaining)`}
								</p>
							)}
							{maxFileSize > 0 && (
								<p>Maximum file size: {formatFileSize(maxFileSize)}</p>
							)}
							{Array.isArray(value) && value.length > 0 && (
								<p>Total size: {formatFileSize(totalSize)}</p>
							)}
						</div>
					</div>
				</div>

				{fileError && (
					<div className="flex items-center mt-2 text-sm text-rose-500 bg-rose-50 p-2 rounded-md border border-rose-200">
						<IconAlertCircle
							className="size-4 mr-1 flex-shrink-0"
							stroke={1.5}
						/>
						<p>{fileError}</p>
					</div>
				)}

				{Array.isArray(value) && value.length > 0 && (
					<motion.div
						className="mt-3"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.2 }}
					>
						<div className="flex justify-between items-center mb-2">
							<p className="text-xs font-medium text-gray-500">
								Uploaded files ({value.length})
							</p>
							{value.length > 1 && (
								<button
									type="button"
									className="text-xs text-rose-500 hover:text-rose-700"
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										if (onFileChange) {
											onFileChange([])
											setFileError(null)
										}
									}}
								>
									Clear all
								</button>
							)}
						</div>
						<div
							className="space-y-2 overflow-y-auto"
							style={{ maxHeight }}
						>
							{value.map((file, index) => (
								<motion.div
									key={index}
									className="flex items-center justify-between bg-white rounded-md p-2 border border-gray-200 shadow-sm"
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -10 }}
									transition={{ duration: 0.15, delay: index * 0.05 }}
								>
									<div className="flex items-center">
										<IconFile
											className="size-5 text-blue-500 mr-2"
											stroke={1.5}
										/>
										<div>
											<p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
												{file.name}
											</p>
											<p className="text-xs text-gray-500">
												{formatFileSize(file.size)} •{' '}
												{file.type || 'Unknown type'}
											</p>
										</div>
									</div>
									<div className="flex gap-1">
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.95 }}
											type="button"
											className="p-1 text-blue-500 hover:bg-blue-50 rounded-full"
											onClick={(e) => {
												e.preventDefault()
												e.stopPropagation()
												const url = URL.createObjectURL(file)
												const a = document.createElement('a')
												a.href = url
												a.download = file.name
												document.body.appendChild(a)
												a.click()
												document.body.removeChild(a)
												URL.revokeObjectURL(url)
											}}
										>
											<IconDownload
												className="size-4"
												stroke={1.5}
											/>
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.95 }}
											type="button"
											className="p-1 text-rose-500 hover:bg-rose-50 rounded-full"
											onClick={(e) => removeFile(index, e)}
										>
											<IconTrash className="size-4" stroke={1.5} />
										</motion.button>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}

				{error && (
					<p className="mt-1 text-sm text-rose-500 flex items-center">
						<IconAlertCircle className="size-4 mr-1" stroke={1.5} />
						{error}
					</p>
				)}
			</div>
		)
	}

	return (
		<div className="relative">
			{label && (
				<label
					htmlFor={id}
					className="block text-xs md:text-sm font-medium text-slate mb-1.5 pointer-events-none"
				>
					{label} {required && <span className="text-rose-500">*</span>}
				</label>
			)}
			<div className="relative group">
				<div className="absolute left-3 z-10 top-1/2 -translate-y-1/2 text-black dark:text-white transition duration-700 pointer-events-none">
					{icon}
				</div>
				<input
					id={id}
					type={inputType}
					disabled={disabled}
					className={cn(
						'w-full px-10 py-3 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200 shadow-sm placeholder:text-gray-500/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 hover:border-slate-300',
						shouldShowClearButton || type === 'password' ? 'pr-10' : '',
						className,
					)}
					placeholder={placeholder}
					value={
						typeof value === 'boolean'
							? ''
							: typeof value === 'string' || typeof value === 'number'
								? value
								: ''
					}
					onChange={onChange}
					{...props}
				/>
				{type === 'password' && (
					<div
						className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600"
						onClick={() => setShowPassword(!showPassword)}
						aria-label={showPassword ? 'Hide password' : 'Show password'}
					>
						{showPassword ? (
							<IconEyeOff
								size={20}
								stroke={1.5}
								className="text-black"
							/>
						) : (
							<IconEye size={20} stroke={1.5} className="text-black" />
						)}
					</div>
				)}
				{shouldShowClearButton && (
					<div
						className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600 z-10"
						onClick={handleClear}
						aria-label="Clear input"
					>
						<IconX size={20} stroke={1.5} className="text-black" />
					</div>
				)}
			</div>
			{error && (
				<p className="mt-1 text-sm text-rose-500 flex items-center">
					<IconAlertCircle className="size-4 mr-1" stroke={1.5} />
					{error}
				</p>
			)}
		</div>
	)
}

export default Input
