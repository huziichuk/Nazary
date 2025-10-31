import { createContext } from 'react'

type MasterKeyContextType = {
	masterKey: CryptoKey | null
	setMasterKey: (key: CryptoKey) => void
	clearSession: () => void
}

export const MasterKeyContext = createContext<MasterKeyContextType | null>(null)
