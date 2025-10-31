import { useAuth } from '@/hooks/useAuth'
import { useMasterKey } from '@/hooks/useMasterKey'
import { pageConfig } from '@/pageConfig'
import Loading from '@/pages/loading/Loading'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const ProtectedRoute = () => {
	const { isAuthenticated, isLoading } = useAuth()

	const { masterKey } = useMasterKey()

	const navigate = useNavigate()

	useEffect(() => {
		if (isLoading) return
		if (!isAuthenticated || !masterKey) navigate(pageConfig.login)
	}, [isAuthenticated, isLoading, masterKey, navigate])
	if (isLoading) return <Loading />

	return <Outlet />
}

export default ProtectedRoute
