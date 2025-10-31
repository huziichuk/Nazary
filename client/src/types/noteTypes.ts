export interface ICreateEncryptedNote {
	titleCipher: string
	titleNonce: string
	contentCipher: string
	contentNonce: string
	tagsCipher: string
	tagsNonce: string
	blindTokens: string[]
}

export interface IEncryptedNote extends ICreateEncryptedNote {
	id: string
	isFavorite: boolean
	createdAt: string
	updatedAt: string
}

export interface ICreateNote {
	title: string
	content: string
	tags: string[]
}

export interface INote extends ICreateNote {
	id: string
	isFavorite: boolean
	createdAt: string
	updatedAt: string
}

export interface ICreateNoteApiResponse {
	id: string
	message: string
}

export type sortBy = 'created' | 'updated'

export type order = 'asc' | 'desc'

export interface ISearchNotes {
	blindTokens: string[]
	sortBy?: sortBy
	order?: order
	isFavorite?: boolean
}

export interface IGetNotes {
	order?: order
	sortBy?: sortBy
	isFavorite?: boolean
}
