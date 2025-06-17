import {
	Box,
	Button,
	Flex,
	Icon,
	IconButton,
	Text,
	Wrap,
	WrapItem
} from '@chakra-ui/react'
import { SessionQRDialog } from 'components/SessionQRModal/SessionQRDialog'
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
import { motion } from 'framer-motion'
import i18next from 'i18next'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiOutlineQrcode } from 'react-icons/ai'
import { ScheduleCardProps } from './ScheduleCard.types'
import { cardAnimationVariants } from './scheduleCard.animations'

const MotionBox = motion(Box)

const ScheduleCard: React.FC<ScheduleCardProps> = ({ item, width }) => {
	const { t } = useTranslation()
	// const currentLang = useTranslation().i18n.language as 'ru' | 'en'
	const currentLang = i18next.resolvedLanguage as 'ru' | 'en'

	const formatTime = (timeString: string) => timeString.slice(0, 5)

	function capitalizeFirstLetter(val: string) {
		return String(val).charAt(0).toUpperCase() + String(val).slice(1)
	}

	const [isQRDialogOpen, setQRDialogOpen] = useState(false)

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
							{/* <Box width='24px'>
							<Icon as={AiOutlineQrcode} boxSize={6} />
							
						</Box> */}
							<Text
								fontSize='2xl'
								// fontWeight='bold'
								// fontStyle='light'
								fontFamily='Tirto'
								mb={1}
							>
								{item.lesson_period.lesson_number}
							</Text>
							<Box overflow='hidden' width='100%' textAlign='center'>
								<Text fontWeight='bold' fontSize='lg' mb={2}>
									{item.subject.name[currentLang]}
								</Text>

								<Wrap gap={2} mb={2} justify='center'>
									<Tag colorPalette='blue'>
										{/* {t(
										`scheduleCard.lessonTypes.${item.lesson_type.name.en.toLowerCase()}`
									)} */}
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

								{/* {!item.location.is_virtual && (
								<Text fontSize='sm' mb={1}>
									{t('scheduleCard.teacher')}:{' '}
									{[
										capitalizeFirstLetter(item.teacher.last_name[currentLang]),
										capitalizeFirstLetter(
											item.teacher.first_name[currentLang].charAt(0) + '.'
										),
										capitalizeFirstLetter(
											item.teacher.patronymic[currentLang].charAt(0) + '.'
										)
									].join(' ')}
								</Text>
							)} */}

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
							{/* <Box width='24px'> */}
							<IconButton
								variant='ghost'
								aria-label='qr-code'
								onClick={e => {
									e.stopPropagation()
									setQRDialogOpen(true)
								}}
							>
								<Icon as={AiOutlineQrcode} boxSize={6} />
							</IconButton>
						</Flex>
					</MotionBox>
				</DialogTrigger>

				<DialogContent bg='{colors.bg}'>
					<DialogHeader>
						<DialogTitle>{item.subject.name[currentLang]}</DialogTitle>
					</DialogHeader>
					<DialogBody>
						<Text mb={2}>{item.subject.description[currentLang]}</Text>

						<Wrap spacing={2} mb={3}>
							<Tag colorPalette='blue'>
								{t('scheduleCard.common.lessonNumber')}:{' '}
								{item.lesson_period.lesson_number}
							</Tag>
							<Tag colorPalette='green'>
								{t(
									`scheduleCard.weekDays.${item.schedule.day_of_week.name.en.toLowerCase()}`
								)}
							</Tag>
						</Wrap>

						<Text mb={2}>
							{t('scheduleCard.teacherContact')}:{' '}
							{item.teacher.phone || t('scheduleCard.noContact')}
						</Text>

						<Text fontWeight='bold' mb={1}>
							{t('scheduleCard.allGroups')}:
						</Text>
						<Wrap spacing={2}>
							{item.groups.map(group => (
								<WrapItem key={group.id}>
									<Tag colorPalette='teal'>{group.name[currentLang]}</Tag>
								</WrapItem>
							))}
						</Wrap>
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

			{/* QR Dialog controlled from here */}
			<SessionQRDialog
				isOpen={isQRDialogOpen}
				setOpen={setQRDialogOpen}
				schedule_id={item.id}
			/>
		</>
	)
}

export default ScheduleCard
