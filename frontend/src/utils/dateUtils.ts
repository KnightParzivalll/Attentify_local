import dayjs from 'dayjs'

import { CarouselItem } from 'components/carousel'

import 'dayjs/locale/en'
import 'dayjs/locale/ru'

export function generateDatesInterval(
	today: string,
	language: string = 'en',
	interval: number = 5
): CarouselItem<string>[] {
	return Array.from({ length: interval * 2 + 1 }, (_, i) => {
		const date = dayjs(today)
			.add(i - interval, 'day')
			.locale(language) // Set locale for each date

		return {
			value: date.format('YYYY-MM-DD'),
			label: date.locale(language).format('D MMMM').toLowerCase(), // Localized month abbreviation
			ariaLabel: date.locale(language).format('dddd, D MMMM YYYY') // Full date for accessibility
		}
	})
}

export function isValidDate(date: Date | any) {
	return true
}

export function getWeekdayName(
	date: string,
	offset: number = 0,
	language: string = 'en'
): string {
	const adjustedDate = dayjs(date).add(offset, 'day')
	const weekday = adjustedDate.locale(language).format('dddd') // Gets the full weekday name in Russian
	return weekday.charAt(0).toUpperCase() + weekday.slice(1) // Capitalizing the first letter
}

export function getFormattedDate(
	date: string,
	offset: number = 0,
	language: string = 'en'
): string {
	const adjustedDate = dayjs(date).add(offset, 'day').locale(language)
	return adjustedDate.format('D MMMM') // Formats the date to '10 марта'
}

export const getDates = (selectedDate: string) => {
	const today = dayjs(selectedDate)
	return {
		yesterday: today.subtract(1, 'day').format('YYYY-MM-DD'),
		today: today.format('YYYY-MM-DD'),
		tomorrow: today.add(1, 'day').format('YYYY-MM-DD')
	}
}
