import { IGroups } from 'types/group'

export default async function getGroups(token: string): Promise<IGroups[]> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/teacher/schedule/groups`,
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

	return response.json() as Promise<IGroups[]>
}
