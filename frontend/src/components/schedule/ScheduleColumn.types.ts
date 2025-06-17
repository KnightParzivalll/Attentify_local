import { BoxProps } from '@chakra-ui/react'
import { LessonResponse } from 'types/schedule'

export interface ScheduleColumnProps extends BoxProps {
	/** Title label for the column (e.g. day name) */
	label: string
	/** Optional date to display header information */
	date?: string
	/** Indicates if schedule data is currently loading */
	isLoading: boolean
	/** Any error encountered during loading */
	error: unknown
	/** Array of schedule items to display */
	scheduleData?: LessonResponse[] | undefined
	/** Optionally hide this column on small screens */
	isHidden?: boolean
	/** Width of the column (default '340px') */
	width?: string
}
