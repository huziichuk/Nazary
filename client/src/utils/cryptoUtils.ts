export async function deriveMasterKey(
	password: string,
	saltBase64: string
): Promise<CryptoKey> {
	const enc = new TextEncoder()
	const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0))

	const keyMaterial = await crypto.subtle.importKey(
		'raw',
		enc.encode(password),
		{ name: 'PBKDF2' },
		false,
		['deriveKey']
	)

	return await crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt,
			iterations: 100_000,
			hash: 'SHA-256',
		},
		keyMaterial,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']
	)
}

export async function encryptField(plaintext: string, masterKey: CryptoKey) {
	const enc = new TextEncoder()
	const data = enc.encode(plaintext)
	const nonce = crypto.getRandomValues(new Uint8Array(12))

	const ciphertext = await crypto.subtle.encrypt(
		{ name: 'AES-GCM', iv: nonce },
		masterKey,
		data
	)

	return {
		ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
		nonce: btoa(String.fromCharCode(...nonce)),
	}
}

export async function decryptField(
	ciphertextBase64: string,
	nonceBase64: string,
	masterKey: CryptoKey
) {
	const ciphertext = Uint8Array.from(atob(ciphertextBase64), c =>
		c.charCodeAt(0)
	)
	const nonce = Uint8Array.from(atob(nonceBase64), c => c.charCodeAt(0))

	const plaintextBuffer = await crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv: nonce },
		masterKey,
		ciphertext
	)

	return new TextDecoder().decode(plaintextBuffer)
}

export async function generateBlindTokens(title: string, tags: string[]) {
	const tokens: string[] = []

	async function sha256Base64(input: string): Promise<string> {
		const encoder = new TextEncoder()
		const data = encoder.encode(input)
		const hashBuffer = await crypto.subtle.digest('SHA-256', data)
		const hashArray = Array.from(new Uint8Array(hashBuffer))
		const hashString = String.fromCharCode(...hashArray)
		return btoa(hashString)
	}

	for (const word of title.toLowerCase().split(/\s+/)) {
		tokens.push(await sha256Base64(word))
	}

	for (const tag of tags) {
		tokens.push(await sha256Base64(tag.toLowerCase()))
	}

	return tokens
}
