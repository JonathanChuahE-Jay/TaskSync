import React, { useRef, useState } from 'react'
import { cn } from '@/utils/utils.ts'
import { IconEdit } from '@tabler/icons-react'

interface AvatarProps {
	src?: string
	alt?: string
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
	status?: 'online' | 'offline' | 'busy' | 'away' | null
	statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
	editable?: boolean
	onImageChange?: (file: File) => void
	className?: string
	imgClassName?: string
	fallbackInitials?: string
	editIconClassName?: string
	statusClassName?: string
	editContainerClassName?: string
	onImageError?: () => void
	editIcon?: React.ReactNode
	border?: boolean
	borderColor?: string
	borderWidth?: string
	onClick?: () => void
	onMouseLeave?: () => void
	onMouseEnter?: () => void
}

const Avatar: React.FC<AvatarProps> = ({
	onClick,
	onMouseLeave,
	onMouseEnter,
	src,
	alt = 'User Avatar',
	size = 'xl',
	status = null,
	statusPosition = 'bottom-right',
	editable = false,
	onImageChange,
	className = '',
	imgClassName = '',
	fallbackInitials = '',
	editIconClassName = '',
	statusClassName = '',
	editContainerClassName = '',
	onImageError,
	editIcon,
	border = false,
	borderColor = 'border-gray-200',
	borderWidth = 'border',
}) => {
	const [imageSrc, setImageSrc] = useState<string | undefined>(src)
	const [imageError, setImageError] = useState<boolean>(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const sizeClasses = {
		xs: 'size-8',
		sm: 'size-10',
		md: 'size-16',
		lg: 'size-20',
		xl: 'size-24',
	}

	const statusColors = {
		online: 'bg-green-400',
		offline: 'bg-gray-400',
		busy: 'bg-red-400',
		away: 'bg-yellow-400',
	}

	const positionClasses = {
		'top-right': 'top-0 right-0',
		'top-left': 'top-0 left-0',
		'bottom-right': 'bottom-0 right-0',
		'bottom-left': 'bottom-0 left-0',
	}
	const editContainerSizeClasses = {
		xs: 'size-4',
		sm: 'size-5',
		md: 'size-6',
		lg: 'size-7',
		xl: 'size-8',
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const imageUrl = URL.createObjectURL(file)
			setImageSrc(imageUrl)
			setImageError(false)
			if (onImageChange) {
				onImageChange(file)
			}
		}
	}

	const handleEditClick = () => {
		fileInputRef.current?.click()
	}

	const handleImageError = () => {
		setImageError(true)
		if (onImageError) {
			onImageError()
		}
	}
	const editContainerSizeClass =
		typeof size === 'number'
			? `size-${Math.max(5, Math.floor(size / 2.5))}`
			: editContainerSizeClasses[size]

	const sizeClass =
		typeof size === 'number' ? `size-${size}` : sizeClasses[size]

	const editIconSize =
		typeof size === 'number'
			? Math.max(10, Math.floor(size / 3))
			: {
					xs: 10,
					sm: 12,
					md: 14,
					lg: 16,
					xl: 18,
				}[size]
	const borderStyles = border ? `${borderWidth} ${borderColor}` : ''

	const renderContent = () => {
		if (imageSrc && !imageError) {
			return (
				<img
					src={imageSrc}
					alt={alt}
					onError={handleImageError}
					className={`${sizeClass} rounded-full object-cover ${borderStyles} ${imgClassName}`}
				/>
			)
		} else if (fallbackInitials) {
			return (
				<div
					className={`flex items-center justify-center bg-gray-200 text-gray-600 font-medium rounded-full ${sizeClass} ${borderStyles} ${className}`}
					style={{
						fontSize: typeof size === 'number' ? size / 3 : undefined,
					}}
				>
					{fallbackInitials.slice(0, 2).toUpperCase()}
				</div>
			)
		} else {
			return (
				<div
					className={`flex items-center justify-center bg-gray-200 rounded-full ${sizeClass} ${borderStyles} ${className}`}
				>
					<svg
						className="text-gray-400 size-1/2"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
					</svg>
				</div>
			)
		}
	}

	return (
		<div className={`relative inline-block ${className}`} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
			{renderContent()}

			{status && (
				<span
					className={`absolute block ${positionClasses[statusPosition]} ${
						status === 'offline' ? 'size-3' : 'size-4'
					} rounded-full ${statusColors[status]} ring-2 ring-white ${statusClassName}`}
				/>
			)}

			{editable && (
				<>
					<div
						onClick={handleEditClick}
						className={cn(
							'absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition-colors',
							editContainerSizeClass,
							editContainerClassName,
						)}
					>
						{editIcon || (
							<IconEdit
								size={editIconSize}
								className={cn('text-gray-600', editIconClassName)}
							/>
						)}
					</div>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						className="hidden"
						aria-label="Upload avatar"
					/>
				</>
			)}
		</div>
	)
}

export default Avatar
