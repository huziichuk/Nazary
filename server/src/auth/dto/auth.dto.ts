import {IsEmail, IsNotEmpty, Matches, MaxLength, MinLength} from "class-validator";
import AUTH_MESSAGES from "../../constants/auth.messages";

export class LoginDto {
    @IsEmail()
    @MaxLength(256)
    email: string;

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