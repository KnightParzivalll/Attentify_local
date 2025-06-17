export type BaseID = number

// Localization interfaces
export interface LocalizedNameField {
	ru: string
	en: string
}

export interface LocalizedDescriptionField {
	en?: string
	ru?: string
}

export interface GroupResponse {
	id: BaseID
	name: LocalizedNameField
	description: LocalizedDescriptionField
}
