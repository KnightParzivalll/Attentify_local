import { useQuery } from '@tanstack/react-query'
import getAttendanceForDay from 'api/getAttendanceForDay'
import { IAttendanceRecord } from 'types/attendance'

const useAttendanceForDay = (
	token: string | null,
	subject_id: number | null,
	lesson_date: string | null
) => {
	return useQuery<IAttendanceRecord[]>({
		queryKey: ['attendanceForDay', subject_id, lesson_date, token],
		queryFn: () => {
			if (!token || !subject_id || !lesson_date) {
				return Promise.reject(new Error('Missing required parameters'))
			}
			return getAttendanceForDay(token, subject_id, lesson_date)
		},
		enabled: !!token && !!subject_id && !!lesson_date
	})
}

export default useAttendanceForDay
