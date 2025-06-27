import type { Dispatch, SetStateAction } from 'react'
import type { UserDataTyoe } from '@/types/user.ts'

/* -------------------- Tabs & Sorting -------------------- */

export type ProjectManagementSortOptionType =
	| 'Recent updated'
	| 'Oldest first'
	| 'Alphabetical'
	| 'Priority'

export type ProjectManagementTabsIDType =
	| 'list'
	| 'calendar'
	| 'chart'
	| 'tasks'
	| 'grid'

export interface ProjectManagementTab {
	id: ProjectManagementTabsIDType
	label: string
	icon: React.ReactNode
}

export interface ProjectManagementToolPropsType {
	sortOption: ProjectManagementSortOptionType
	setSortOption: Dispatch<SetStateAction<ProjectManagementSortOptionType>>
	activeTab: ProjectManagementTabsIDType
	setActiveTab: Dispatch<SetStateAction<ProjectManagementTabsIDType>>
}

/* -------------------- Enums -------------------- */

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

/* -------------------- Project -------------------- */

export interface ProjectListResponseType {
	id: string
	title: string
	description: string
	start_date: string
	due_date: string | null
	status: ProjectStatusType | string
	progress_percentage: number
	attachment_files: Array<ProjectAttachmentFile> 
	created_at: string
	updated_at: string
	updated_by: UserDataTyoe
	status_date: string | null
	color: string | null
	priority: string
	project_teams: Array<ProjectTeamType>
	project_roles: Array<ProjectRoleType>
	tags: Array<string>
}

/* -------------------- Roles -------------------- */

export interface ProjectRoleType {
	id: number
	name: string
	project: string
}

export interface ProjectRolesCreationType {
	projectId: string
	roles: Array<{ name: string }>
}

export interface ProjectRolesCreationResponseType {
	id: number
	name: string
	project: string
}

/* -------------------- Team -------------------- */

export interface ProjectTeamType {
	id: number
	user: UserDataTyoe
	role: string
	is_creator: boolean
	project_title: string
}

export interface ProjectTeamMemberType {
	id: number
	user: UserDataTyoe
	role: ProjectRoleType
	is_creator: boolean
	project_title: string
}

export interface ProjectFormTeamMember {
	friendId: string
	name: string
	role: string
	userId: string
}

/* -------------------- Attachments -------------------- */

export interface ProjectAttachmentFile extends File {
	lastModified: number
	lastModifiedDate: Date
	name: string
	size: number
	type: string
	webkitRelativePath: string
}

/* -------------------- UI -------------------- */

export type ProjectManagementPriorityOptionsType = {
	prefix: React.ReactNode
	value: string
	label: string
	description: string
}
