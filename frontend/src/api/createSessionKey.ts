export interface SessionKeyResponse {
	session_key: string
	ttl_seconds: number
}

export default async function createSessionKey(
	token: string
): Promise<SessionKeyResponse> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/session/create`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		}
	)

	if (!response.ok) {
		throw new Error(`HTTP error! ${response.status}`)
	}

	return response.json()
}
