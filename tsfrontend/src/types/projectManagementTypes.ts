import type { Dispatch, SetStateAction } from 'react'
import type { Role } from '@/types/user.ts'

export interface ProjectManagementTab {
	id: projectManagementTabsIDType
	label: string
	icon: React.ReactNode
}

export interface ProjectManagementToolPropsType {
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

export enum ProjectStatusType {
	Active = 'active',
	NOT_STARTED = 'not_started',
	IN_PROGRESS = 'in_progress',
	COMPLETED = 'completed',
	PLANNING = 'planning',
	AT_RISK = 'at_risk',
	CRITICAL = 'critical',
	ON_HOLD = 'on_hold',
}

export interface ProjectTeamMemberType {
		id: number
		user: UserType
		role: ProjectRoleType
		is_creator: boolean
		project_title: string
	}

export interface ProjectListResponseType {
	id: string
	updated_by: UserType
	project_teams: Array<ProjectTeamType>
	project_roles: Array<ProjectRoleType>
	progress_percentage: number
	title: string
	description: string
	start_date: string
	due_date: string | null
	status: ProjectStatusType
	attachments: any
	created_at: string
	updated_at: string
	status_date: string | null
	color: string
	priority: number
}

export interface UserType {
	id: string
	username: string
	email: string
	first_name: string
	last_name: string
	phone_number: string
	role: Role
}

export interface ProjectTeamType {
	id: number
	user: UserType
	role: ProjectRoleType
	is_creator: boolean
	project_title: string
}

export interface ProjectRoleType {
	id: number
	name: string
	project: string
}

export type ProjectManagementPriorityOptionsType = {
	prefix: React.ReactNode
	value: string
	label: string
	description: string
}