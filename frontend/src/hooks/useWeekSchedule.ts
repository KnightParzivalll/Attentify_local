import { useQuery } from '@tanstack/react-query'
import getWeekSchedule from 'api/getWeekSchedule'
// import { IWeekSchedule } from 'types'
import { WeekResponse } from 'types/schedule'

// const useWeekSchedule = (
// 	label: string,
// 	week_type: string,
// 	groups_ids: number[]
// ) => {
// 	return useQuery<IWeekSchedule>({
// 		queryKey: ['fetchWeekSchedule', label, week_type, groups_ids],
// 		queryFn: () => getWeekSchedule(week_type, groups_ids)
// 	})
// }

const useWeekSchedule = (
	label: string,
	week_type: string,
	groups_ids: number[],
	only_for_me: boolean,
	token: string | null
) => {
	return useQuery<WeekResponse>({
		queryKey: [
			'fetchWeekSchedule',
			label,
			week_type,
			groups_ids,
			only_for_me,
			token
		],
		queryFn: () => {
			if (typeof token !== 'string' || !token) {
				return Promise.reject(new Error('No valid token provided'))
			}
			return getWeekSchedule(week_type, groups_ids, only_for_me, token)
		},
		enabled: typeof token === 'string' && !!token
	})
}

export default useWeekSchedule
