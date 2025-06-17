// api/getProfile.ts
import type { UserProfileResponse } from 'types/profile'

export default async function getProfile(
	token: string
): Promise<UserProfileResponse> {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/me`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			}
		})

		if (!response.ok) {
			throw new Error(
				`HTTP error! status: ${response.status} - ${response.statusText}`
			)
		}

		const data = await response.json()
		return data as UserProfileResponse
	} catch (error) {
		console.error('Failed to fetch profile:', error)
		throw new Error(
			error instanceof Error
				? error.message
				: 'Failed to fetch profile due to an unknown error'
		)
	}
}
