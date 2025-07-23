export interface ILoginDto {
	email: string
	password: string
}

export interface IRegisterDto {
	name?: string
	email: string
	password: string
	confirmPassword: string
}

export interface IResetPasswordDto {
	email: string
}
