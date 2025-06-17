import { LessonResponse } from 'types/schedule'

export interface ScheduleCardProps {
	/** The schedule item to display */
	item: LessonResponse
	/** Optional width for the card (e.g., '340px') */
	width?: string
}
