import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';
import AUTH_MESSAGES from '../../constants/auth.messages';
import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '../../decorators/trim.decorator';

export class CreateUserDto {
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
	@MinLength(7)
	@MaxLength(256)
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
