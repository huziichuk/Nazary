import { apiCreateNote } from '@/api/notes'
import { pageConfig } from '@/pageConfig'
import type { ICreateEncryptedNote } from '@/types/noteTypes'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export function useCreateNote() {
	const qc = useQueryClient()
	const navigate = useNavigate()
	return useMutation({
		mutationFn: async (payload: ICreateEncryptedNote) => {
			const r = await apiCreateNote(payload)
			return r.data
		},
		onSuccess: data => {
			qc.invalidateQueries({ queryKey: ['notes', 'list'] })
			qc.invalidateQueries({ queryKey: ['notes', 'search'] })
			navigate(pageConfig.noteLink(data.id))
		},
	})
}
