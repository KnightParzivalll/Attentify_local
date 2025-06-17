// types/schedule.ts
import {
	BaseID,
	GroupResponse,
	LocalizedDescriptionField,
	LocalizedNameField
} from './core'

export interface LessonPeriodResponse {
	id: BaseID
	lesson_number: number
	start_time: string
	end_time: string
}

export interface WeekTypeResponse {
	id: BaseID
	name: LocalizedNameField
}

export interface DayOfWeekResponse {
	id: BaseID
	day_number: number
	name: LocalizedNameField
}

export interface SubjectResponse {
	id: BaseID
	name: LocalizedNameField
	description: LocalizedDescriptionField
}

export interface TeacherResponse {
	id: BaseID
	user_id: number
	first_name: LocalizedNameField
	last_name: LocalizedNameField
	patronymic: LocalizedNameField
	phone?: string
}

export interface LessonTypeResponse {
	id: BaseID
	name: LocalizedNameField
}

export interface SiteResponse {
	id: BaseID
	name: LocalizedNameField
	description: LocalizedDescriptionField
}

export interface LocationResponse {
	site: SiteResponse
	room_number?: string
	is_virtual: boolean
}

export interface ScheduleResponse {
	term_id: BaseID
	day_of_week: DayOfWeekResponse
	week_type: WeekTypeResponse
}

export interface LessonResponse {
	id: BaseID
	lesson_period: LessonPeriodResponse
	subject: SubjectResponse
	teacher: TeacherResponse
	lesson_type: LessonTypeResponse
	location: LocationResponse
	schedule: ScheduleResponse
	groups: GroupResponse[]
}

export interface WeekResponse {
	[key: string]: LessonResponse[] // Keys are weekdays, values are arrays of lessons
}

// export interface WeekLessonResponse {
// 	id: BaseID
// 	lesson_period: LessonPeriodResponse
// 	subject: SubjectResponse
// 	teacher: TeacherResponse
// 	lesson_type: LessonTypeResponse
// 	location: LocationResponse
// 	schedule: ScheduleResponse
// 	groups: GroupResponse[]
// }
