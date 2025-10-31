import { apiLogout } from '@/api/auth'
import { useMasterKey } from '@/hooks/useMasterKey'
import { useQueryClient } from '@tanstack/react-query'

export const useLogout = () => {
	const qc = useQueryClient()
	const { clearSession } = useMasterKey()

	return async () => {
		await apiLogout()
		qc.invalidateQueries({ queryKey: ['me'] })
		clearSession()
	}
}
