import {IsEmail, IsNotEmpty, IsOptional, Matches, MaxLength, MinLength} from "class-validator";
import AUTH_MESSAGES from "../../constants/auth.messages";

export class CreateUserDto {
    @IsEmail()
    @MaxLength(256)
    email: string;

    @IsOptional()
    @MaxLength(256)
    name:string;

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