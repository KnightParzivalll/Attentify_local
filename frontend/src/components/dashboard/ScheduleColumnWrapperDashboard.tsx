import { Box, Text } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { LessonResponse } from 'types/schedule'
import ScheduleColumnDashboard from './ScheduleColumnDashboard'

interface ScheduleColumnWrapperProps {
	day: { value: string; label: string } | null
	isLoading: boolean
	error: any
	scheduleData: LessonResponse[]
	label?: string
	date: string
}

const ScheduleColumnWrapperDashboard: React.FC<ScheduleColumnWrapperProps> = ({
	day,
	isLoading,
	error,
	scheduleData,
	label,
	date
}) => {
	return (
		<AnimatePresence mode='wait' key={day ? day.value : label}>
			{/* // TODO replace with breakpoint */}
			{/* <Box width='450px'> */}
			<Box
				width={{
					base: '340px',
					sm: '420px',
					md: '430px',
					lg: '340px',
					xl: '390px'
				}}
			>
				{day && (
					<Text width='100%' fontWeight='bold' textAlign='center'>
						{day.label}
					</Text>
				)}
				<ScheduleColumnDashboard
					label={day ? day.label : label || ''}
					isLoading={isLoading}
					error={error}
					scheduleData={scheduleData}
					date={date}
				/>
			</Box>
		</AnimatePresence>
	)
}

export default ScheduleColumnWrapperDashboard
