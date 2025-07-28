import { ApiProperty } from '@nestjs/swagger';
import {
	IsEmail,
	IsNotEmpty,
	IsNumberString,
	IsOptional,
	Length,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import AUTH_MESSAGES from 'src/constants/auth.messages';
import { Trim } from '../../decorators/trim.decorator';

export class LoginDto {
	@ApiProperty()
	@IsEmail()
	@MaxLength(256)
	@Trim()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	password: string;
}

export class RegisterDto {
	@ApiProperty()
	@IsEmail()
	@MaxLength(256)
	@Trim()
	email: string;

	@ApiProperty()
	@IsOptional()
	@MaxLength(256)
	@Trim()
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	@MaxLength(256)
	@MinLength(7)
	@Matches(/(?=.*[a-z])/, {
		message: AUTH_MESSAGES.VALIDATION.LOWERCASE,
	})
	@Matches(/(?=.*[A-Z])/, {
		message: AUTH_MESSAGES.VALIDATION.UPPERCASE,
	})
	@Matches(/(?=.*\d)/, {
		message: AUTH_MESSAGES.VALIDATION.NUMBER,
	})
	password: string;
}

export class ResendVerifyDto {
	@ApiProperty()
	@IsEmail()
	@MaxLength(256)
	@Trim()
	email: string;
}

export class RequestPasswordResetDto {
	@Trim()
	@IsEmail()
	@ApiProperty()
	email: string;
}

export class VerifyPasswordResetDto {
	@Trim()
	@IsNumberString()
	@Length(6)
	@ApiProperty()
	code: string;
}

export class ResetPasswordDto {
	@Trim()
	@IsNumberString()
	@ApiProperty()
	@Length(6)
	code: string;

	@ApiProperty()
	@IsNotEmpty()
	@MaxLength(256)
	@MinLength(7)
	@Matches(/(?=.*[a-z])/, {
		message: AUTH_MESSAGES.VALIDATION.LOWERCASE,
	})
	@Matches(/(?=.*[A-Z])/, {
		message: AUTH_MESSAGES.VALIDATION.UPPERCASE,
	})
	@Matches(/(?=.*\d)/, {
		message: AUTH_MESSAGES.VALIDATION.NUMBER,
	})
	newPassword: string;
}
