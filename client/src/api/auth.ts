import type {ILoginDto, IRegisterDto} from "@/types/authTypes.ts";
import api from "@/api/api.ts";
import type {IApiGeneral} from "@/types/generalTypes.ts";

export const apiRegister = async (data: IRegisterDto) => api.post<IApiGeneral>('/auth/register', data)

export const apiLogin = async (data: ILoginDto) => api.post<IApiGeneral>('/auth/login', data)

export const apiLogout = async () => api.post<IApiGeneral>('/auth/logout')

export const apiConfirmEmail = async (token: string) => api.post<IApiGeneral>(`/auth/verify-email?token=${token}`)