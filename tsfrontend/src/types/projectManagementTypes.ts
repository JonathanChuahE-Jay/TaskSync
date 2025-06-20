import type { Dispatch, SetStateAction } from 'react'
import type { Role } from '@/types/user.ts'

export interface ProjectManagementTab {
	id: projectManagementTabsIDType
	label: string
	icon: React.ReactNode
}

export interface ProjectManagementToolProps {
	sortOption: ProjectManagementSortOptionType
	setSortOption: Dispatch<SetStateAction<ProjectManagementSortOptionType>>
	activeTab: projectManagementTabsIDType
	setActiveTab: Dispatch<SetStateAction<projectManagementTabsIDType>>
}

export type ProjectManagementSortOptionType =
	| 'Recent updated'
	| 'Oldest first'
	| 'Alphabetical'
	| 'Priority'

export type projectManagementTabsIDType =
	| 'list'
	| 'calendar'
	| 'chart'
	| 'tasks'
	| 'grid'

export interface ProjectListResponse {
	id: string
	updated_by: User
	project_teams: Array<ProjectTeam>
	project_roles: Array<ProjectRole>
	progress_percentage: number
	title: string
	description: string
	start_date: string
	due_date: string | null
	status: 'not_started' | 'in_progress' | 'completed' | string
	attachments: any 
	created_at: string
	updated_at: string
	status_date: string | null
	color: string
	priority: number
}

export interface User {
	id: string
	username: string
	email: string
	first_name: string
	last_name: string
	phone_number: string
	role: Role
}

export interface ProjectTeam {
	id: number
	user: User
	role: ProjectRole
	is_creator: boolean
	project_title: string
}

export interface ProjectRole {
	id: number
	name: string
	project: string
}
