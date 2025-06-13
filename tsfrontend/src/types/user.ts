export interface UserData {
	id: number
	username: string
	email: string
	first_name: string
	last_name: string
	phone_number: string | undefined | null
	role: Role
}

export enum Role {
	MEMBER = 'MEMBER',
	GUEST = 'GUEST',
	ADMIN = 'ADMIN',
}
