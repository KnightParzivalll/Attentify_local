export interface SessionKeyCheckResponse {
	teacher_id: number
}

export async function checkSessionKey(
	sessionKey: string
): Promise<SessionKeyCheckResponse> {
	const response = await fetch(
		`${import.meta.env.VITE_API_URL}/session/check`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({ session_key: sessionKey })
		}
	)

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(errorText || 'Failed to validate session key')
	}

	return response.json() as Promise<SessionKeyCheckResponse>
}
