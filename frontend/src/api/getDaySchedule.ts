import { LessonResponse } from 'types/schedule'

export default async function getDaySchedule(
	targetDate: string,
	onlyForMe: boolean,
	token: string
): Promise<LessonResponse[]> {
	const response = await fetch(
		import.meta.env.VITE_API_URL +
			`/teacher/schedule/day?target_date=${targetDate}&only_for_me=${onlyForMe}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch groups!')
	}
	return response.json() as Promise<LessonResponse[]>
}
