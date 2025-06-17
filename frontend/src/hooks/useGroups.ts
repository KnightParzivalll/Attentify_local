import { useQuery } from '@tanstack/react-query'
import getGroups from 'api/getGroups'
import type { IGroups } from 'types/group'

const useGroups = (label: string, token: string | null) => {
	return useQuery<IGroups[]>({
		queryKey: ['fetchGroups', label, token],
		queryFn: () => {
			if (typeof token !== 'string' || !token) {
				return Promise.reject(new Error('No valid token provided'))
			}
			return getGroups(token)
		},
		enabled: typeof token === 'string' && !!token
	})
}

export default useGroups
