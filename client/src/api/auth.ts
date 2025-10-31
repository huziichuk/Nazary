import api from '@/api/api.ts'
import type {
	ILoginDto,
	IRegisterDto,
	ISetNewPassword,
} from '@/types/authTypes.ts'
import type {
	IApiGeneral,
	IApiIsAuth,
	IApiLogin,
} from '@/types/generalTypes.ts'

export const apiRegister = async (data: IRegisterDto) =>
	api.post<IApiGeneral>('/auth/register', data)

export const apiLogin = async (data: ILoginDto) =>
	api.post<IApiLogin>('/auth/login', data)

export const apiIsAuth = async () => api.get<IApiIsAuth>('/auth/is-auth')

export const apiLogout = async () => api.post<IApiGeneral>('/auth/logout')

export const apiLogoutAll = async () =>
	api.post<IApiGeneral>('/auth/logout/all')

export const apiConfirmEmail = async (token: string) =>
	api.post<IApiGeneral>(`/auth/verify-email?token=${token}`)

export const apiResendVerification = async (email: string) =>
	api.post<IApiGeneral>('/auth/resend-verification', { email })

export const apiRequestResetPassword = async (email: string) =>
	api.post<IApiGeneral>('/auth/request-password-reset', { email: email })

export const apiVerifyResetPassword = async (code: string) =>
	api.post<IApiGeneral>('/auth/verify-password-reset', { code: code })

export const apiSetNewPassword = async (data: ISetNewPassword) =>
	api.post<IApiGeneral>('/auth/password-reset', data)
