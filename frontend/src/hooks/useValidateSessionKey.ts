import { useMutation } from '@tanstack/react-query'
import { checkSessionKey } from 'api/checkSessionKey'

export const useValidateSessionKey = () => {
	return useMutation({
		mutationFn: checkSessionKey
	})
}
