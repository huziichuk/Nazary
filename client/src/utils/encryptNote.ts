import type {
	ICreateEncryptedNote,
	ICreateNote,
	IEncryptedNote,
	INote,
} from '@/types/noteTypes'
import { decryptField, encryptField, generateBlindTokens } from './cryptoUtils'

export async function encryptNote(
	note: ICreateNote,
	masterKey: CryptoKey
): Promise<ICreateEncryptedNote> {
	const [title, content, tags] = await Promise.all([
		encryptField(note.title, masterKey),
		encryptField(note.content, masterKey),
		encryptField(note.tags.join(','), masterKey),
	])

	const blindTokens = await generateBlindTokens(note.title, note.tags)

	return {
		titleCipher: title.ciphertext,
		titleNonce: title.nonce,
		contentCipher: content.ciphertext,
		contentNonce: content.nonce,
		tagsCipher: tags.ciphertext,
		tagsNonce: tags.nonce,
		blindTokens,
	}
}

export async function decryptNote(
	encryptedNote: IEncryptedNote,
	masterKey: CryptoKey
): Promise<INote> {
	const [title, content, tagsStr] = await Promise.all([
		decryptField(
			encryptedNote.titleCipher,
			encryptedNote.titleNonce,
			masterKey
		),
		decryptField(
			encryptedNote.contentCipher,
			encryptedNote.contentNonce,
			masterKey
		),
		decryptField(encryptedNote.tagsCipher, encryptedNote.tagsNonce, masterKey),
	])

	return {
		id: encryptedNote.id,
		title,
		content,
		tags: tagsStr.split(','),
		isFavorite: encryptedNote.isFavorite,
		createdAt: encryptedNote.createdAt,
		updatedAt: encryptedNote.updatedAt,
	}
}
