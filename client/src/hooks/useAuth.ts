import { apiIsAuth } from '@/api/auth'
import { useQuery } from '@tanstack/react-query'

export const useAuth = () => {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['me'],
		queryFn: async () => {
			const res = await apiIsAuth()
			return res.data
		},
		retry: false,
	})

	return {
		user: data,
		isAuthenticated: !!data?.id,
		isLoading,
		isError,
	}
}
