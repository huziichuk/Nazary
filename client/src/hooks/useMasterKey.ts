import { MasterKeyContext } from '@/contexts/MasterKeyContext'
import { useContext } from 'react'

export const useMasterKey = () => {
	const context = useContext(MasterKeyContext)
	if (!context)
		throw new Error('useMasterKey must be used within MasterKeyProvider')
	return context
}
