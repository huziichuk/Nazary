import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '../../decorators/trim.decorator';
import AUTH_MESSAGES from 'src/constants/auth.messages';

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
