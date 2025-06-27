import {
	IconPlus,
	IconSearch,
	IconUser,
	IconUsers,
	IconX,
} from '@tabler/icons-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDefaultFieldContext } from './DefaultAppForm'
import type { FriendListResponse } from '@/types/friends.ts'
import Input from '@/components/reusable/Input'

interface Role {
	id?: number
	name: string
}

interface User {
	id: string // friend.friend.id (user ID)
	name: string // Display name
	friendId: string // The friendship relationship ID
}

interface TeamMember {
	userId: string // friend.friend.id
	friendId: string // The friendship ID
	name: string // Display name for UI
	role: string // Role name for display (backward compatibility)
}

interface UserSelectFieldProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		'prefix' | 'value'
	> {
	label?: string
	darker?: boolean
	error?: string | undefined
	tooltip?: React.ReactNode
	prefix?: React.ReactNode
	InputFieldClassName?: string
	clearFieldError?: (fieldName: string) => void
	apiErrors?: Record<string, string | undefined>
	dropdownClassName?: string
	tagClassName?: string
	tagsContainerClassName?: string
	removeButtonClassName?: string
	placeholder?: string
	darkMode?: boolean
	users?: Array<FriendListResponse>
	roles?: Array<string> | Array<Role>
}

const UserSelectField = React.forwardRef<
	HTMLInputElement,
	UserSelectFieldProps
>(
	(
		{
			label = 'Team Members',
			error,
			tooltip,
			prefix = <IconUser className="size-5" />,
			InputFieldClassName,
			clearFieldError = () => {},
			apiErrors = {},
			dropdownClassName,
			tagClassName,
			tagsContainerClassName,
			removeButtonClassName,
			placeholder = 'Search for a user',
			darkMode = false,
			users = [],
			roles = [],
			...props
		},
		ref,
	) => {
		const field = useDefaultFieldContext<Array<TeamMember>>()
		const [searchValue, setSearchValue] = useState('')
		const [isDropdownOpen, setIsDropdownOpen] = useState(false)
		const [showRoleDropdown, setShowRoleDropdown] = useState<string | null>(
			null,
		)
		const [activeTab, setActiveTab] = useState<'available' | 'selected'>(
			'available',
		)
		const inputRef = useRef<HTMLInputElement>(null)
		const dropdownRef = useRef<HTMLDivElement>(null)
		const roleDropdownRef = useRef<HTMLDivElement>(null)
		const containerRef = useRef<HTMLDivElement>(null)
		const roleButtonRefs = useRef(new Map<string, HTMLButtonElement | null>())

		const teamMembers = Array.isArray(field.state.value)
			? field.state.value
			: []

		const selectedUserIds = useMemo(() => {
			return teamMembers.map((member) => member.userId)
		}, [teamMembers])

		const availableUsers: Array<User> = useMemo(() => {
			return users.map((friend) => ({
				id: friend.friend.id,
				name: `${friend.friend.first_name} ${friend.friend.last_name || ''}`,
				friendId: friend.id,
			}))
		}, [users])

		const normalizedRoles: Array<string> = useMemo(() => {
			return roles.map((role) => {
				if (typeof role === 'string') return role
				return role.name
			})
		}, [roles])

		const filteredUsers = useMemo(() => {
			return availableUsers.filter(
				(user) =>
					user.name.toLowerCase().includes(searchValue.toLowerCase()) &&
					!selectedUserIds.includes(user.id),
			)
		}, [searchValue, selectedUserIds, availableUsers])

		useEffect(() => {
			if (
				filteredUsers.length === 0 &&
				teamMembers.length === 0 &&
				isDropdownOpen
			) {
				setIsDropdownOpen(false)
			}
		}, [filteredUsers.length, teamMembers.length, isDropdownOpen])

		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					containerRef.current &&
					!containerRef.current.contains(event.target as Node)
				) {
					setIsDropdownOpen(false)
				}
				if (
					showRoleDropdown &&
					roleDropdownRef.current &&
					!roleDropdownRef.current.contains(event.target as Node)
				) {
					const button = roleButtonRefs.current.get(showRoleDropdown)
					if (!button || !button.contains(event.target as Node)) {
						setShowRoleDropdown(null)
					}
				}
			}
			document.addEventListener('mousedown', handleClickOutside)
			return () => {
				document.removeEventListener('mousedown', handleClickOutside)
			}
		}, [showRoleDropdown])

		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			setSearchValue(e.target.value)
			if (!isDropdownOpen) setIsDropdownOpen(true)
			if (activeTab !== 'available') setActiveTab('available')
		}

		const handleInputFocus = () => {
			setIsDropdownOpen(true)
			setActiveTab('available')
		}

		const handleSelectUser = (user: User, e: React.MouseEvent) => {
			e.preventDefault()

			const defaultRole =
				normalizedRoles.length > 0 ? normalizedRoles[0] : ''

			const newTeamMember: TeamMember = {
				userId: user.id,
				friendId: user.friendId,
				name: user.name,
				role: defaultRole,
			}

			const newTeamMembers = [...teamMembers, newTeamMember]
			field.handleChange(newTeamMembers)
			setSearchValue('')
			clearFieldError(field.name)

			setActiveTab('selected')
		}

		const handleRemoveMember = (index: number, e: React.MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
			const newTeamMembers = teamMembers.filter((_, i) => i !== index)
			field.handleChange(newTeamMembers)
			if (newTeamMembers.length === 0 && filteredUsers.length === 0) {
				setIsDropdownOpen(false)
			}
		}

		const handleRoleClick = (userId: string, e: React.MouseEvent) => {
			e.preventDefault()
			e.stopPropagation()
			setShowRoleDropdown(showRoleDropdown === userId ? null : userId)
		}

		const setRoleButtonRef = (
			userId: string,
			element: HTMLButtonElement | null,
		) => {
			if (element) {
				roleButtonRefs.current.set(userId, element)
			}
		}

		const handleRoleSelect = (
			memberIndex: number,
			roleName: string,
			e: React.MouseEvent,
		) => {
			e.preventDefault()
			e.stopPropagation()
			const newTeamMembers = [...teamMembers]
			newTeamMembers[memberIndex] = {
				...newTeamMembers[memberIndex],
				role: roleName,
			}
			field.handleChange(newTeamMembers)
			setShowRoleDropdown(null)
		}

		const errorMessage =
			field.state.meta.errors[0] || error || apiErrors[field.name]
		const dropdownThemeClass = darkMode
			? 'bg-gray-800 border-gray-700 text-white'
			: 'bg-white border-gray-300 text-gray-700'
		const dropdownItemHoverClass = darkMode
			? 'hover:bg-gray-700'
			: 'hover:bg-gray-100'
		const tagThemeClass = darkMode
			? 'bg-gray-700 text-gray-100'
			: 'bg-blue-100 text-blue-800'
		const removeButtonThemeClass = darkMode
			? 'text-gray-300 hover:text-gray-100'
			: 'text-red-500 hover:text-red-700'
		const tabActiveClass = darkMode
			? 'bg-gray-700 text-white border-b-2 border-blue-500'
			: 'bg-white text-blue-600 border-b-2 border-blue-500'
		const tabInactiveClass = darkMode
			? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
			: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
		const roleButtonClass = darkMode
			? 'bg-gray-700 hover:bg-gray-600 text-white'
			: 'bg-blue-100 hover:bg-blue-200 text-blue-800'

		useEffect(() => {
			if (showRoleDropdown && roleDropdownRef.current) {
				const buttonElement = roleButtonRefs.current.get(showRoleDropdown)
				if (!buttonElement) return
				const buttonRect = buttonElement.getBoundingClientRect()
				const dropdownRect = roleDropdownRef.current.getBoundingClientRect()
				let top = buttonRect.bottom + 5
				let left = buttonRect.left
				if (left + dropdownRect.width > window.innerWidth) {
					left = window.innerWidth - dropdownRect.width - 10
				}
				if (top + dropdownRect.height > window.innerHeight) {
					top = buttonRect.top - dropdownRect.height - 5
				}
				roleDropdownRef.current.style.top = `${top}px`
				roleDropdownRef.current.style.left = `${left}px`
			}
		}, [showRoleDropdown])

		console.log(filteredUsers)
		return (
			<div ref={containerRef} className="relative w-full">
				<Input
					type="text"
					ref={ref || inputRef}
					id={field.name}
					label={label}
					placeholder={placeholder}
					icon={prefix}
					value={searchValue}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					className={InputFieldClassName}
					error={errorMessage}
					darker={darkMode}
					{...props}
				/>
				{/* Dropdown panel with tabs */}
				<AnimatePresence>
					{isDropdownOpen &&
						(filteredUsers.length > 0 || teamMembers.length > 0) && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.15 }}
								className={`mt-1 border rounded overflow-hidden shadow-lg absolute z-20 w-full ${dropdownClassName || ''}`}
							>
								<div className="flex">
									<button
										type="button"
										className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
											activeTab === 'available'
												? tabActiveClass
												: tabInactiveClass
										}`}
										onClick={() => setActiveTab('available')}
									>
										<div className="flex items-center justify-center">
											<IconSearch className="mr-2 size-4" />
											Available Users
											{filteredUsers.length > 0 && (
												<span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-blue-500 text-white">
													{filteredUsers.length}
												</span>
											)}
										</div>
									</button>
									<button
										type="button"
										className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${
											activeTab === 'selected'
												? tabActiveClass
												: tabInactiveClass
										}`}
										onClick={() => setActiveTab('selected')}
									>
										<div className="flex items-center justify-center">
											<IconUsers className="mr-2 size-4" />
											Selected
											{teamMembers.length > 0 && (
												<span className="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-blue-500 text-white">
													{teamMembers.length}
												</span>
											)}
										</div>
									</button>
								</div>
								{/* Tab content */}
								<div
									ref={dropdownRef}
									className={`${dropdownThemeClass}`}
								>
									<AnimatePresence mode="wait">
										{activeTab === 'available' && (
											<motion.div
												key="available-tab"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												className="max-h-60 overflow-y-auto"
											>
												{filteredUsers.length > 0 ? (
													filteredUsers.map((user) => (
														<div
															key={`user-${user.id}`}
															className={`p-3 flex justify-between items-center ${dropdownItemHoverClass} cursor-pointer border-b border-gray-200 dark:border-gray-700`}
															onClick={(e) =>
																handleSelectUser(user, e)
															}
														>
															<div className="flex items-center">
																<IconUser className="mr-3 size-5 text-gray-400" />
																<span className="font-medium">
																	{user.name}
																</span>
															</div>
															<div className="flex items-center">
																{normalizedRoles.length > 0 && (
																	<span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 mr-3">
																		{normalizedRoles[0]}
																	</span>
																)}
																<IconPlus className="size-5 opacity-70" />
															</div>
														</div>
													))
												) : (
													<div className="p-4 text-center text-gray-500 dark:text-gray-400">
														{searchValue
															? 'No users found'
															: 'Search for users to add'}
													</div>
												)}
											</motion.div>
										)}
										{activeTab === 'selected' && (
											<motion.div
												key="selected-tab"
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												className="max-h-60 overflow-y-auto"
											>
												{teamMembers.length > 0 ? (
													teamMembers.map((member, index) => (
														<div
															key={`member-${index}-${member.userId}`}
															className={`p-3 flex justify-between items-center ${dropdownItemHoverClass} border-b border-gray-200 dark:border-gray-700`}
														>
															<div className="flex items-center">
																<IconUser className="mr-3 size-5 text-gray-400" />
																<span className="font-medium">
																	{member.name}
																</span>
															</div>
															<div className="flex items-center ml-auto">
																<button
																	ref={(el) =>
																		setRoleButtonRef(
																			member.userId,
																			el,
																		)
																	}
																	type="button"
																	className={`mr-3 px-3 py-1 text-sm rounded-full ${roleButtonClass} transition-colors`}
																	onClick={(e) =>
																		handleRoleClick(
																			member.userId,
																			e,
																		)
																	}
																>
																	{member.role ||
																		'Select role'}
																</button>
																<button
																	type="button"
																	className={`${removeButtonThemeClass} ${removeButtonClassName || ''}`}
																	onClick={(e) =>
																		handleRemoveMember(
																			index,
																			e,
																		)
																	}
																>
																	<IconX className="size-5" />
																</button>
															</div>
														</div>
													))
												) : (
													<div className="p-4 text-center text-gray-500 dark:text-gray-400">
														No team members selected yet
													</div>
												)}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</motion.div>
						)}
				</AnimatePresence>
				{/* Role dropdown (outside of main dropdown) */}
				<AnimatePresence>
					{showRoleDropdown && (
						<motion.div
							ref={roleDropdownRef}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.15 }}
							className={`border rounded shadow-lg fixed z-30 overflow-y-auto ${dropdownThemeClass}`}
						>
							<div
								className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} px-3 py-1.5 text-xs font-medium border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
							>
								Select Role
							</div>
							{normalizedRoles.map((role, roleIndex) => {
								const memberIndex = teamMembers.findIndex(
									(m) => m.userId === showRoleDropdown,
								)
								const isSelected =
									memberIndex >= 0 &&
									teamMembers[memberIndex].role === role
								return (
									<div
										key={`role-${roleIndex}`}
										className={`p-2.5 text-sm cursor-pointer whitespace-nowrap ${dropdownItemHoverClass} ${
											isSelected
												? darkMode
													? 'bg-gray-700'
													: 'bg-blue-50'
												: ''
										}`}
										onClick={(e) =>
											handleRoleSelect(memberIndex, role, e)
										}
									>
										{role}
									</div>
								)
							})}
						</motion.div>
					)}
				</AnimatePresence>
				{!isDropdownOpen && teamMembers.length > 0 && (
					<div
						className={`mt-3 space-y-2 ${tagsContainerClassName || ''}`}
					>
						{teamMembers.map((member, index) => (
							<div
								key={`tag-${index}-${member.userId}`}
								className={`p-2 rounded flex justify-between items-center ${tagThemeClass} ${tagClassName || ''}`}
							>
								<div className="flex items-center">
									<IconUser className="mr-2 size-4" />
									<span>{member.name}</span>
								</div>
								<div className="flex items-center ml-auto">
									<button
										ref={(el) => setRoleButtonRef(member.userId, el)}
										type="button"
										className={`mr-2 px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-600' : 'bg-blue-200'} hover:opacity-90`}
										onClick={(e) => handleRoleClick(member.userId, e)}
									>
										{member.role}
									</button>
									<button
										type="button"
										className={`${removeButtonThemeClass} ${removeButtonClassName || ''}`}
										onClick={(e) => handleRemoveMember(index, e)}
									>
										<IconX className="size-4" />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		)
	},
)

UserSelectField.displayName = 'UserSelectField'
export default UserSelectField
