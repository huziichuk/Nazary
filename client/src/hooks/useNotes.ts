import { apiGetNotes } from '@/api/notes'
import type { IEncryptedNote, IGetNotes } from '@/types/noteTypes'
import { useQuery } from '@tanstack/react-query'

export function useNotesEncrypted(dto: IGetNotes) {
	return useQuery<IEncryptedNote[]>({
		queryKey: [
			'notes',
			'list',
			`favorite=${dto.isFavorite}|order=${dto.order}|sortBy=${dto.sortBy}`,
		],
		queryFn: async () => {
			const r = await apiGetNotes(dto)
			return r.data
		},
		staleTime: 60_000,
	})
}
