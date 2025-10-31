import { apiSearchNotes } from '@/api/notes'
import type { ISearchNotes } from '@/types/noteTypes'
import { useQuery } from '@tanstack/react-query'
import { useMasterKey } from './useMasterKey'

export function useSearchNotes(dto: ISearchNotes) {
	const { masterKey } = useMasterKey()
	const key = [
		'notes',
		'search',
		`${dto.sortBy} | ${dto.order}`,
		dto.blindTokens.join('|'),
	]

	return useQuery({
		queryKey: key,
		staleTime: 60_000,
		queryFn: async () => {
			const r = await apiSearchNotes(dto)
			return r.data
		},
		enabled: !!masterKey && dto.blindTokens.length > 0,
	})
}
