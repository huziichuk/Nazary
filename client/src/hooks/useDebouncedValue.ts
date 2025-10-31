import { useEffect, useState } from 'react'
export function useDebouncedValue<T>(value: T, delay: number = 300) {
	const [v, setV] = useState<T>(value)
	useEffect(() => {
		const id = setTimeout(() => setV(value), delay)
		return () => clearTimeout(id)
	}, [value, delay])
	return v
}
