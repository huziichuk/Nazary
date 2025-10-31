export interface IApiGeneral {
	message: string[] | string
}

export interface IApiLogin {
	salt: string
}

export interface IApiIsAuth {
	salt: string
	id: string
	email: string
	createdAt: string
	name: string
}
