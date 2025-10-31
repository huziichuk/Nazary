import { apiLogin } from '@/api/auth.ts'
import { pageConfig } from '@/pageConfig'
import type { ILoginDto } from '@/types/authTypes.ts'
import { deriveMasterKey } from '@/utils/cryptoUtils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMasterKey } from './useMasterKey'

export const useLogin = () => {
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const masterKeyContext = useMasterKey()

	const [password, setPassword] = useState<string | null>(null)

	const mutation = useMutation({
		mutationFn: (dto: ILoginDto) => {
			setPassword(dto.password)
			return apiLogin(dto)
		},
		onSuccess: async data => {
			await queryClient.invalidateQueries({ queryKey: ['me'] })
			if (password) {
				const masterKey = await deriveMasterKey(password, data.data.salt)
				masterKeyContext.setMasterKey(masterKey)
			}
			navigate(pageConfig.dashboard)
		},
		onError: (e: unknown) => {
			if (e instanceof AxiosError) {
				if (e.response?.status === 403) {
					navigate(pageConfig.verifyEmail)
				}
			}
			console.log(e)
		},
	})

	return {
		login: mutation.mutate,
		loginAsync: mutation.mutateAsync,
		isLoading: mutation.status === 'pending',
		isSuccess: mutation.status === 'success',
		isError: mutation.status === 'error',
		error: mutation.error,
	}
}
