import { Box, Text, VStack } from '@chakra-ui/react'
import ScheduleErrorLoadMessage from 'components/ScheduleErrorLoadMessage'
import ScheduleSkeletonLoader from 'components/ScheduleSkeletonLoader'
import { motion } from 'framer-motion'
import i18next from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { getFormattedDate, getWeekdayName } from 'utils/dateUtils'
import ScheduleCard from './ScheduleCard' // Assuming you have ScheduleCard in its own file
import { ScheduleColumnProps } from './ScheduleColumn.types'
import {
	scheduleColumnVariants,
	scheduleDataVariants,
	scheduleItemVariants
} from './scheduleColumn.animations'

// Create a motion-enabled Box.
const MotionBox = motion(Box)

const ScheduleColumn: React.FC<ScheduleColumnProps> = ({
	label,
	date,
	isLoading,
	error,
	scheduleData,
	isHidden,
	width = '100%',
	...rest
}) => {
	const { t } = useTranslation()
	// const currentLang = useTranslation().i18n.language as 'ru' | 'en'
	const currentLang = i18next.resolvedLanguage as 'ru' | 'en'

	return (
		<motion.div
			variants={scheduleColumnVariants}
			initial='initial'
			animate='animate'
			exit='exit'
			transition={{ duration: 1.3, ease: 'easeInOut' }}
			{...rest}
		>
			<VStack
				display={{ base: isHidden ? 'none' : 'block', '2xl': 'block' }}
				h='100%'
				width={width}
			>
				{date && (
					<Box textAlign='center'>
						<Text fontSize='2xl' fontWeight='semibold'>
							{getWeekdayName(date, 0, currentLang)}
						</Text>
						<Text fontSize='sm' fontWeight='light'>
							({getFormattedDate(date, 0, currentLang)})
						</Text>
					</Box>
				)}

				{isLoading ? (
					<ScheduleSkeletonLoader />
				) : error ? (
					<ScheduleErrorLoadMessage />
				) : (
					<motion.div
						style={{ width: '100%' }}
						variants={scheduleDataVariants}
						initial='initial'
						animate='animate'
						transition={{ duration: 0.3, ease: 'easeOut' }}
					>
						<VStack gap='12px'>
							{!scheduleData?.length && (
								<Text
									textAlign='center'
									fontSize='md'
									fontWeight='semibold'
									mt={4}
								>
									{t('scheduleCard.noData')}
								</Text>
							)}
							{scheduleData?.map(item => (
								<motion.div
									key={item.id}
									style={{ width: '100%' }}
									variants={scheduleItemVariants}
									initial='initial'
									animate='animate'
									exit='exit'
									transition={{ duration: 1.2, delay: 0.1 }}
								>
									<ScheduleCard item={item} width={width} />
								</motion.div>
							))}
						</VStack>
					</motion.div>
				)}
			</VStack>
		</motion.div>
	)
}

export default ScheduleColumn
