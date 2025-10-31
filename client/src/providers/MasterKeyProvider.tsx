import { MasterKeyContext } from '@/contexts/MasterKeyContext'
import { useState } from 'react'

const MasterKeyProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [masterKey, setMasterKeyState] = useState<CryptoKey | null>(null)

	const setMasterKey = (key: CryptoKey) => {
		setMasterKeyState(key)
	}

	const clearSession = () => {
		setMasterKeyState(null)
	}

	return (
		<MasterKeyContext.Provider
			value={{ masterKey, setMasterKey, clearSession }}
		>
			{children}
		</MasterKeyContext.Provider>
	)
}
export default MasterKeyProvider
