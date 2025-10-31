import { apiGetNote } from '@/api/notes'
import type { IEncryptedNote } from '@/types/noteTypes'
import { useQuery } from '@tanstack/react-query'

export function useNoteEncrypted(id?: string) {
	return useQuery<IEncryptedNote | null>({
		queryKey: ['notes', id],
		queryFn: async () => {
			if (!id) return null
			const r = await apiGetNote(id)
			return r.data
		},
		staleTime: 60_000,
		enabled: !!id,
	})
}
