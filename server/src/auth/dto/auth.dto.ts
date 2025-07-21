import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
