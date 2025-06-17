import { Badge, Box, Button, Flex, Text, VStack, Wrap } from '@chakra-ui/react'
import {
	DialogActionTrigger,
	DialogBody,
	DialogCloseTrigger,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogRoot,
	DialogTitle,
	DialogTrigger
} from 'components/ui/dialog'
import { Tag } from 'components/ui/tag'
import { useAuth } from 'contexts/AuthContext'
import { motion } from 'framer-motion'
import useAttendanceForDay from 'hooks/useAttendanceForDay'
import i18next from 'i18next'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ScheduleCardProps } from '../schedule/ScheduleCard.types'
import { cardAnimationVariants } from '../schedule/scheduleCard.animations'

const MotionBox = motion(Box)

interface ScheduleCardDashboardProps extends ScheduleCardProps {
	date: string // Assuming date is a string in 'YYYY-MM-DD' format
}

const ScheduleCardDashboard: React.FC<ScheduleCardDashboardProps> = ({
	item,
	width,
	date
}) => {
	const { t } = useTranslation()
	const currentLang = i18next.resolvedLanguage as 'ru' | 'en'
	const { token } = useAuth()

	const formatTime = (timeString: string) => timeString.slice(0, 5)

	function capitalizeFirstLetter(val: string) {
		return String(val).charAt(0).toUpperCase() + String(val).slice(1)
	}

	const { data, isLoading, isError } = useAttendanceForDay(
		token,
		item.subject.id,
		date
	)

	return (
		<>
			<DialogRoot>
				<DialogTrigger asChild>
					<MotionBox
						height='100%'
						borderWidth='1px'
						borderRadius='lg'
						p={4}
						m={2}
						cursor='pointer'
						width={width}
						_hover={{ boxShadow: 'md' }}
						initial='initial'
						animate='animate'
						exit='exit'
						variants={cardAnimationVariants}
					>
						<Flex align='center' gap='30px' justifyContent='space-between'>
							<Text fontSize='2xl' fontFamily='Tirto' mb={1}>
								{item.lesson_period.lesson_number}
							</Text>
							<Box overflow='hidden' width='100%' textAlign='center'>
								<Text fontWeight='bold' fontSize='lg' mb={2}>
									{item.subject.name[currentLang]}
								</Text>

								<Wrap gap={2} mb={2} justify='center'>
									<Tag colorPalette='blue'>
										{capitalizeFirstLetter(item.lesson_type.name[currentLang])}
									</Tag>
									<Tag colorPalette='purple'>
										{capitalizeFirstLetter(
											item.schedule.week_type.name[currentLang]
										)}
									</Tag>
									{item.location.is_virtual && (
										<Tag colorPalette='orange'>
											{t('scheduleCard.lessonTypes.virtual')}
										</Tag>
									)}
								</Wrap>

								<Text fontSize='sm' mb={1}>
									{t('scheduleCard.time')}:{' '}
									{formatTime(item.lesson_period.start_time)} -{' '}
									{formatTime(item.lesson_period.end_time)}
								</Text>

								{!item.location.is_virtual && (
									<Text fontSize='sm' mb={1}>
										{`${t('scheduleCard.room')}: ${item.location.site.name[currentLang]}${item.location.room_number}`}
									</Text>
								)}

								{item.groups.length > 0 && (
									<Text fontSize='sm' color='gray.600'>
										{t('scheduleCard.groups')}:{' '}
										{item.groups
											.slice(0, 3)
											.map(g => g.name[currentLang])
											.join(', ')}
										{item.groups.length > 3 &&
											t('scheduleCard.groupDisplay.showMore', {
												count: item.groups.length - 3
											})}
									</Text>
								)}
							</Box>
						</Flex>
					</MotionBox>
				</DialogTrigger>

				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t('scheduleCard.attendance.title')}</DialogTitle>
					</DialogHeader>
					<DialogBody>
						{isLoading && <Text>{t('scheduleCard.attendance.loading')}</Text>}
						{isError && (
							<Text color='red.500'>{t('scheduleCard.attendance.error')}</Text>
						)}
						{!isLoading && data && (
							<VStack spacing={3} align='stretch'>
								{data.map(record => (
									<Flex
										key={record.student_id}
										align='center'
										justify='space-between'
										p={3}
										borderWidth='1px'
										borderRadius='md'
										// bg={record.attended ? 'green.50' : 'red.50'}
									>
										<Box>
											<Text>
												{record.last_name} {record.first_name}
											</Text>
											<Text fontSize='sm' color='gray.600'>
												{record.group_name ||
													t('scheduleCard.attendance.noGroup')}
											</Text>
										</Box>
										<Badge
											colorScheme={record.attended ? 'green' : 'red'}
											variant='solid'
											borderRadius='full'
											px={3}
											py={1}
										>
											{record.attended
												? t('scheduleCard.attendance.present')
												: t('scheduleCard.attendance.absent')}
										</Badge>
									</Flex>
								))}
							</VStack>
						)}
					</DialogBody>
					<DialogFooter>
						<DialogActionTrigger asChild>
							<Button variant='outline'>
								{t('scheduleCard.common.close')}
							</Button>
						</DialogActionTrigger>
					</DialogFooter>
					<DialogCloseTrigger />
				</DialogContent>
			</DialogRoot>
		</>
	)
}

export default ScheduleCardDashboard
