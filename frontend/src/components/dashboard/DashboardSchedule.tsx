import { HStack, useBreakpointValue, VStack } from '@chakra-ui/react'
import { useAuth } from 'contexts/AuthContext'
import dayjs from 'dayjs'
import { useDaySchedule } from 'hooks'
import React, { JSX, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { LessonResponse } from 'types/schedule'
import { generateDatesInterval, getDates } from 'utils/dateUtils'
import ScheduleColumnWrapperDashboard from './ScheduleColumnWrapperDashboard'

type DisplayMode = 'small' | 'medium' | 'large'

interface DashboardScheduleProps {
	selectedDate: string // Optional prop for initial date, if needed
}

const DashboardSchedule: React.FC<DashboardScheduleProps> = ({
	selectedDate
}) => {
	const { i18n } = useTranslation()
	const { token } = useAuth()

	const today = dayjs().format('YYYY-MM-DD')

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

	const {
		data: scheduleDataToday,
		isLoading: isLoadingToday,
		error: errorToday
	} = useDaySchedule('today', todayDate, onlyForMe, token)

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

		<ScheduleColumnWrapperDashboard
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
			</>
		)
	} else {
		// Large screens: render three columns (yesterday, today, tomorrow).
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
			</>
		)
	}

	return (
		<VStack
			width='100%'
			gap={{ base: '25px', lg: '30px', '2xl': '45px' }}
			alignItems='center'
		>
			<HStack gap='40px' alignItems='flex-start'>
				{scheduleColumns}
			</HStack>
		</VStack>
	)
}

export default DashboardSchedule
