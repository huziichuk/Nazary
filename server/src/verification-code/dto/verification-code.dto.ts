import { IsString } from 'class-validator';

export class VerificationCodeCheckDto {
	@IsString()
	code: string;
}
