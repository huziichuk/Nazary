import { RegisterDto } from 'src/auth/dto/auth.dto';

export class CreateUserDto extends RegisterDto {
	confirmToken: string;
}
