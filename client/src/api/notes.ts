import api from '@/api/api.ts'
import type {
	ICreateEncryptedNote,
	ICreateNoteApiResponse,
	IEncryptedNote,
	IGetNotes,
	ISearchNotes,
} from '@/types/noteTypes'

export const apiCreateNote = async (data: ICreateEncryptedNote) =>
	api.post<ICreateNoteApiResponse>('/notes', data)

export const apiGetNotes = async (data: IGetNotes) =>
	api.get<IEncryptedNote[]>(
		`notes?sortBy=${data.sortBy}&order=${data.order}&isFavorite=${data.isFavorite}`
	)

export const apiSearchNotes = async (data: ISearchNotes) =>
	api.post<IEncryptedNote[]>('/notes/search', data)

export const apiDeleteNote = async (id: string) => api.delete(`/notes/${id}`)

export const apiGetNote = async (id: string) =>
	api.get<IEncryptedNote>(`/notes/${id}`)

export const apiToggleFavorite = async (id: string, status: boolean) =>
	api.patch(`/notes/${id}/favorite`, { status: status })

export const apiUpdateNote = async (id: string, data: ICreateEncryptedNote) =>
	api.put<IEncryptedNote>(`notes/${id}`, data)
