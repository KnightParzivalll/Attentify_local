import { IAttendanceRecord } from 'types/attendance'

export default async function getAttendanceForDay(
	token: string,
	subject_id: number,
	lesson_date: string
): Promise<IAttendanceRecord[]> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/attendance/day?subject_id=${subject_id}&lesson_date=${lesson_date}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		}
	)

	if (!response.ok) {
		throw new Error('Failed to fetch attendance data!')
	}

	return response.json() as Promise<IAttendanceRecord[]>
}
