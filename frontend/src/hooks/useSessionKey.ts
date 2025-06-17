import { useQuery } from '@tanstack/react-query'
import createSessionKey, { SessionKeyResponse } from 'api/createSessionKey'

const useSessionKey = (enabled: boolean, token: string | null) => {
	return useQuery<SessionKeyResponse>({
		queryKey: ['sessionKey', token],
		queryFn: () => {
			if (!token) throw new Error('No valid token')
			return createSessionKey(token)
		},
		enabled: enabled && !!token,
		retry: 1
	})
}

export default useSessionKey
