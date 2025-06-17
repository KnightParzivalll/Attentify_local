import { HStack, useBreakpointValue, VStack } from '@chakra-ui/react'
import { useSessionStorage } from '@uidotdev/usehooks'
import AnimatedDatesCarousel from 'components/carousel/AnimatedDatesCarousel'
import { useAuth } from 'contexts/AuthContext'
import dayjs from 'dayjs'
import { useDaySchedule } from 'hooks'
import React, { JSX, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { LessonResponse } from 'types/schedule'
import { generateDatesInterval, getDates } from 'utils/dateUtils'
import ScheduleColumnWrapper from './ScheduleColumnWrapper'

type DisplayMode = 'small' | 'medium' | 'large'

const DaysSchedule: React.FC = () => {
	const { i18n } = useTranslation()
	const { token } = useAuth()

	const today = dayjs().format('YYYY-MM-DD')
	const [selectedDate, setSelectedDate] = useSessionStorage<string>(
		'DaysScheduleSelectedDate',
		today
	) // TODO add check if date is valid

	const onlyForMe = false // TODO add switch

	const dates = useMemo(
		() => generateDatesInterval(today, i18n.language),
		[today, i18n.language]
	)

	const {
		yesterday,
		today: todayDate,
		tomorrow
	} = useMemo(() => getDates(selectedDate), [selectedDate])

	const handleDateChange = useCallback((date: string) => {
		setSelectedDate(date)
	}, [])

	const {
		data: scheduleDataYesterday,
		isLoading: isLoadingYesterday,
		error: errorYesterday
	} = useDaySchedule('yesterday', yesterday, onlyForMe, token)
	const {
		data: scheduleDataToday,
		isLoading: isLoadingToday,
		error: errorToday
	} = useDaySchedule('today', todayDate, onlyForMe, token)
	const {
		data: scheduleDataTomorrow,
		isLoading: isLoadingTomorrow,
		error: errorTomorrow
	} = useDaySchedule('tomorrow', tomorrow, onlyForMe, token)

	// Determine display mode: 'small' (mobile), 'medium' (tablet), 'large' (desktop)
	const displayMode = useBreakpointValue({
		base: 'small',
		lg: 'medium',
		'2xl': 'large'
	}) as DisplayMode

	// DRY helper to render a single schedule column.
	const renderScheduleColumn = (
		label: string,
		date: string,
		scheduleData: LessonResponse[] | undefined,
		isLoading: boolean,
		error: any,
		key: string,
		isHidden?: boolean
	): JSX.Element => (
		// <AnimatePresence mode='wait' key={key}>
		// 	<Box width='350px'>
		// 		{/* <Text width='100%' fontWeight='bold' textAlign='center'>
		// 			{label} // TODO Write correct title - should be today only for today!
		// 		</Text> */}
		// 		<ScheduleColumn
		// 			label={label}
		// 			date={date}
		// 			isLoading={isLoading}
		// 			error={error}
		// 			scheduleData={scheduleData}
		// 			isHidden={isHidden}
		// 		/>

		// 	</Box>
		// </AnimatePresence>

		<ScheduleColumnWrapper
			date={date}
			label={label}
			day={null}
			isLoading={isLoading}
			error={error}
			scheduleData={scheduleData || []}
		/>
	)

	// Render schedule columns based on responsive display mode.
	let scheduleColumns: React.ReactNode = null
	if (displayMode === 'small') {
		// Small screens: render one column (for "today").
		scheduleColumns = renderScheduleColumn(
			'today',
			todayDate,
			scheduleDataToday,
			isLoadingToday,
			errorToday,
			todayDate
		)
	} else if (displayMode === 'medium') {
		// Medium screens: render two columns (today and tomorrow).
		scheduleColumns = (
			<>
				{renderScheduleColumn(
					'today',
					todayDate,
					scheduleDataToday,
					isLoadingToday,
					errorToday,
					todayDate
				)}
				{renderScheduleColumn(
					'tomorrow',
					tomorrow,
					scheduleDataTomorrow,
					isLoadingTomorrow,
					errorTomorrow,
					tomorrow
				)}
			</>
		)
	} else {
		// Large screens: render three columns (yesterday, today, tomorrow).
		scheduleColumns = (
			<>
				{renderScheduleColumn(
					'yesterday',
					yesterday,
					scheduleDataYesterday,
					isLoadingYesterday,
					errorYesterday,
					yesterday,
					true
				)}
				{renderScheduleColumn(
					'today',
					todayDate,
					scheduleDataToday,
					isLoadingToday,
					errorToday,
					todayDate
				)}
				{renderScheduleColumn(
					'tomorrow',
					tomorrow,
					scheduleDataTomorrow,
					isLoadingTomorrow,
					errorTomorrow,
					tomorrow,
					true
				)}
			</>
		)
	}

	return (
		<VStack
			width='100%'
			gap={{ base: '25px', lg: '30px', '2xl': '45px' }}
			alignItems='center'
		>
			<AnimatedDatesCarousel
				value={selectedDate}
				onChange={handleDateChange}
				dates={dates}
			/>
			<HStack gap='40px' alignItems='flex-start'>
				{scheduleColumns}
			</HStack>
		</VStack>
	)
}

export default DaysSchedule
