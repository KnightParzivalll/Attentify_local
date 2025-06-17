// hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query'
import getProfile from 'api/getProfile'
import type { UserProfileResponse } from 'types/profile'

const useProfile = (enabled: boolean = false, token: string | null) => {
	return useQuery<UserProfileResponse>({
		queryKey: ['userProfile', token],
		queryFn: async () => {
			if (!token) throw new Error('No valid token provided')

			try {
				return await getProfile(token)
			} catch (error: any) {
				// Check if error is a Response with status 401
				if (error instanceof Response && error.status === 401) {
					// Optionally logout here, or alert user
					// logout()
					alert('Logout needed')
				}
				throw error
			}
		},
		enabled: enabled && !!token,
		staleTime: 1000 * 60 * 5, // 5 minutes cache
		retry: (failureCount, error) => {
			if (error instanceof Response && error.status === 401) {
				return false
			}
			return failureCount < 3
		}
	})
}

export default useProfile
