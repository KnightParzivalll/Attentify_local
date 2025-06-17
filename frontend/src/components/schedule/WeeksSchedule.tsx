import { HStack, VStack, useBreakpointValue } from '@chakra-ui/react'
import { useSessionStorage } from '@uidotdev/usehooks'
import { AnimatedWeekDaysCarousel } from 'components/carousel'
import { useAuth } from 'contexts/AuthContext'
import { useWeekSchedule } from 'hooks'
import { FC, JSX, useMemo } from 'react'
import ScheduleColumnWrapper from './ScheduleColumnWrapper'
import {
	// DAY_GROUPS_LARGE,
	// DAY_GROUPS_MEDIUM,
	useTranslatedConstants
} from './weekScheduleConstants'

interface WeeksScheduleProps {
	weekType: string
	groupIds: string[]
}

type DisplayMode = 'small' | 'medium' | 'large'

const WeeksSchedule: FC<WeeksScheduleProps> = ({ weekType, groupIds }) => {
	const { WEEK_DAYS, DAY_GROUPS_MEDIUM, DAY_GROUPS_LARGE } =
		useTranslatedConstants()

	const { token } = useAuth()

	// Convert groupIds (strings) to numbers.
	const convertedGroupIds = useMemo<number[]>(
		() => groupIds.map(id => Number(id)),
		[groupIds]
	)

	const only_for_me = false // TODO add switch

	// Fetch week schedule data.
	const {
		data: weekScheduleData,
		isLoading,
		error
	} = useWeekSchedule(
		'week_schedule',
		weekType,
		convertedGroupIds,
		only_for_me,
		token
	)

	// Determine display mode using breakpoints.
	const displayMode = useBreakpointValue({
		base: 'small',
		lg: 'medium',
		'2xl': 'large'
	}) as DisplayMode

	// Consolidated selection state for each display mode.
	const [selectedByMode, setSelectedByMode] = useSessionStorage<{
		small: string
		medium: string
		large: string
	}>('WeeksScheduleSelectedMode', {
		small: WEEK_DAYS[0].value,
		medium: DAY_GROUPS_MEDIUM[0].value,
		large: DAY_GROUPS_LARGE[0].value
	})

	// Generic handler to update selection for a given mode.
	const handleSelectionChange = (mode: DisplayMode, value: string) => {
		setSelectedByMode(prev => ({ ...prev, [mode]: value }))
	}

	// Render carousel based on display mode.
	const renderCarousel = (): JSX.Element => {
		if (displayMode === 'small') {
			return (
				<AnimatedWeekDaysCarousel
					value={selectedByMode.small}
					onChange={value => handleSelectionChange('small', value)}
					weekdays={WEEK_DAYS}
				/>
			)
		} else if (displayMode === 'medium') {
			return (
				<AnimatedWeekDaysCarousel
					value={selectedByMode.medium}
					onChange={value => handleSelectionChange('medium', value)}
					weekdays={DAY_GROUPS_MEDIUM}
				/>
			)
		} else {
			return (
				<AnimatedWeekDaysCarousel
					value={selectedByMode.large}
					onChange={value => handleSelectionChange('large', value)}
					weekdays={DAY_GROUPS_LARGE}
				/>
			)
		}
	}

	// Render schedule columns based on display mode.
	const renderScheduleColumns = (): JSX.Element | null => {
		if (displayMode === 'small') {
			// Find the selected day.
			const selectedDay = WEEK_DAYS.find(
				day => day.value === selectedByMode.small
			)
			return selectedDay ? (
				<ScheduleColumnWrapper
					day={selectedDay}
					isLoading={isLoading}
					error={error}
					scheduleData={weekScheduleData?.[selectedDay.value] || []}
				/>
			) : null
		} else if (displayMode === 'medium') {
			// Find the selected group (pair) and render both days.
			const group = DAY_GROUPS_MEDIUM.find(
				group => group.value === selectedByMode.medium
			)
			return group ? (
				<HStack gap='40px' alignItems='flex-start'>
					{group.days.map(day => (
						<ScheduleColumnWrapper
							key={day.value}
							day={day}
							isLoading={isLoading}
							error={error}
							scheduleData={weekScheduleData?.[day.value] || []}
						/>
					))}
				</HStack>
			) : null
		} else {
			// Large mode: find the selected group (triplet) and render all days.
			const group = DAY_GROUPS_LARGE.find(
				group => group.value === selectedByMode.large
			)
			return group ? (
				<HStack gap='40px' alignItems='flex-start'>
					{group.days.map(day => (
						<ScheduleColumnWrapper
							key={day.value}
							day={day}
							isLoading={isLoading}
							error={error}
							scheduleData={weekScheduleData?.[day.value] || []}
						/>
					))}
				</HStack>
			) : null
		}
	}

	return (
		<VStack
			width='100%'
			gap={{ base: '25px', lg: '30px', '2xl': '45px' }}
			alignItems='center'
		>
			{renderCarousel()}
			{renderScheduleColumns()}
		</VStack>
	)
}

export default WeeksSchedule
