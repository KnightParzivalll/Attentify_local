import { WeekResponse } from 'types/schedule'

export default async function getWeekSchedule(
	week_type: string,
	groups_ids: number[],
	only_for_me: boolean,
	token: string
): Promise<WeekResponse> {
	const response = await fetch(
		import.meta.env.VITE_API_URL +
			`/teacher/schedule/week?week_type=${week_type}&groups_ids=${groups_ids}&only_for_me=${only_for_me}`,
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
		throw new Error('Failed to fetch groups!')
	}
	return response.json() as Promise<WeekResponse>
}
