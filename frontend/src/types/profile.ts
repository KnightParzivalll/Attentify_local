import {
	BaseID,
	GroupResponse,
	LocalizedDescriptionField,
	LocalizedNameField
} from './core'

// Profile-related interfaces
export interface ProfileBase {
	id: BaseID
	first_name: LocalizedNameField
	last_name: LocalizedNameField
	patronymic: LocalizedNameField
	phone?: string
}

export interface RoleResponse {
	id: BaseID
	name: LocalizedNameField
	description: LocalizedDescriptionField
}

// Main user profile interface
export interface UserProfileResponse {
	id: BaseID
	email: string
	is_superuser: boolean
	profile: ProfileBase
	role: RoleResponse
	groups?: GroupResponse[] // Optional array with default empty array
}
