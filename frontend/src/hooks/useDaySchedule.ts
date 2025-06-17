import { useQuery } from '@tanstack/react-query'
import getDaySchedule from 'api/getDaySchedule'
// import { ISchedule } from 'types'
import { LessonResponse } from 'types/schedule'

// const useDaySchedule = (label: string, date: string) => {
// 	return useQuery<ISchedule[]>({
// 		queryKey: ['teacherSchedule', label, date],
// 		queryFn: () => getDaySchedule(date)
// 	})
// }

const useDaySchedule = (
	label: string,
	date: string,
	onlyForMe: boolean,
	token: string | null
) => {
	return useQuery<LessonResponse[]>({
		queryKey: ['teacherSchedule', label, date, onlyForMe, token],
		queryFn: () => {
			if (typeof token !== 'string' || !token) {
				return Promise.reject(new Error('No valid token provided'))
			}
			return getDaySchedule(date, onlyForMe, token)
		},
		enabled: typeof token === 'string' && !!token
	})
}
export default useDaySchedule
