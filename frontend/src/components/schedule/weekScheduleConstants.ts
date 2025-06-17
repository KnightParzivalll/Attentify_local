// import { CarouselItem } from 'components/carousel'

// export interface DayGroup {
// 	value: string
// 	label: string
// 	days: CarouselItem<string>[]
// }

// export const WEEK_DAYS: CarouselItem<string>[] = [
// 	{ value: 'Monday', label: 'Понедельник' },
// 	{ value: 'Tuesday', label: 'Вторник' },
// 	{ value: 'Wednesday', label: 'Среда' },
// 	{ value: 'Thursday', label: 'Четверг' },
// 	{ value: 'Friday', label: 'Пятница' },
// 	{ value: 'Saturday', label: 'Суббота' }
// ]

// export const DAY_GROUPS_MEDIUM: DayGroup[] = [
// 	{
// 		value: 'group1',
// 		label: 'Понедельник - Вторник',
// 		days: WEEK_DAYS.slice(0, 2)
// 	},
// 	{ value: 'group2', label: 'Среда – Четверг', days: WEEK_DAYS.slice(2, 4) },
// 	{ value: 'group3', label: 'Пятница – Суббота', days: WEEK_DAYS.slice(4, 6) }
// ]

// export const DAY_GROUPS_LARGE: DayGroup[] = [
// 	{
// 		value: 'group1',
// 		label: 'Понедельник – Среда',
// 		days: WEEK_DAYS.slice(0, 3)
// 	},
// 	{ value: 'group2', label: 'Четверг – Суббота', days: WEEK_DAYS.slice(3, 6) }
// ]

import { CarouselItem } from 'components/carousel'
import { useTranslation } from 'react-i18next'

export interface DayGroup {
	value: string
	label: string
	days: CarouselItem<string>[]
}

export const useTranslatedConstants = () => {
	const { t } = useTranslation()

	const WEEK_DAYS: CarouselItem<string>[] = [
		{ value: 'Monday', label: t('weekDays.monday') },
		{ value: 'Tuesday', label: t('weekDays.tuesday') },
		{ value: 'Wednesday', label: t('weekDays.wednesday') },
		{ value: 'Thursday', label: t('weekDays.thursday') },
		{ value: 'Friday', label: t('weekDays.friday') },
		{ value: 'Saturday', label: t('weekDays.saturday') }
	]

	const DAY_GROUPS_MEDIUM: DayGroup[] = [
		{
			value: 'group1',
			label: t('dayGroups.group1_medium'),
			days: WEEK_DAYS.slice(0, 2)
		},
		{
			value: 'group2',
			label: t('dayGroups.group2_medium'),
			days: WEEK_DAYS.slice(2, 4)
		},
		{
			value: 'group3',
			label: t('dayGroups.group3_medium'),
			days: WEEK_DAYS.slice(4, 6)
		}
	]

	const DAY_GROUPS_LARGE: DayGroup[] = [
		{
			value: 'group1',
			label: t('dayGroups.group1_large'),
			days: WEEK_DAYS.slice(0, 3)
		},
		{
			value: 'group2',
			label: t('dayGroups.group2_large'),
			days: WEEK_DAYS.slice(3, 6)
		}
	]

	return { WEEK_DAYS, DAY_GROUPS_MEDIUM, DAY_GROUPS_LARGE }
}
