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

export interface IRequestResetPasswordDto {
	email: string
}

export type ResetPasswordStage =
	| 'request'
	| 'verify'
	| 'newPassword'
	| 'success'

export interface INewPasswordDto {
	newPassword: string
	confirmNewPassword: string
}

export interface ISetNewPassword extends INewPasswordDto {
	code: string
}
