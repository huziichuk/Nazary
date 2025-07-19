import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {CreateUserDto} from "../user/dto/user.dto";
import AUTH_MESSAGES from "../constants/auth.messages";
import * as bcryptjs from 'bcryptjs';
import {LoginDto} from "./dto/auth.dto";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import * as jwt from "jsonwebtoken";
import CONFIG_CONSTANTS from "../constants/config.constants";
import {nanoid} from "nanoid";
import {SessionService} from "../session/session.service";
import ms, {StringValue} from "ms";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly sessionService: SessionService,
    ) {}

    async register(dto: CreateUserDto) {
        const existingUser = await this.userService.findByEmail(dto.email);
        if (existingUser) {
            throw new BadRequestException(AUTH_MESSAGES.ERROR.USER_ALREADY_EXISTS)
        }
        const hashedPassword = bcryptjs.hashSync(dto.password, 10)
        return await this.userService.create({...dto, password: hashedPassword});
    }

    async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException(AUTH_MESSAGES.ERROR.USER_NOT_FOUND)
        }

        if(!bcryptjs.compareSync(dto.password, user.password)){
            throw new UnauthorizedException(AUTH_MESSAGES.ERROR.WRONG_PASSWORD)
        }

        const token= nanoid(64)

        const session = await this.sessionService.create({
            userId:user.id,
            token,
            expiresAt: new Date(Date.now() + ms(this.configService.get<StringValue>(CONFIG_CONSTANTS.JWT_REFRESH_EXPIRES_IN) || "30d")),
        })

        return this.generateTokens({userId:user.id, token, sessionId:session.id});
    }

    generateAccessToken(id: string) {
        return this.jwtService.sign({id});
    }

    generateRefreshToken({userId, sessionId, token}: {userId:string, sessionId: string, token:string}) {
        return jwt.sign({userId, token, sessionId}, this.configService.get(CONFIG_CONSTANTS.JWT_REFRESH_SECRET)  || "JWT_REFRESH_SECRET" ,{
            expiresIn: this.configService.get(CONFIG_CONSTANTS.JWT_REFRESH_EXPIRES_IN) ,
        })
    }

    generateTokens({userId, sessionId, token}: {userId:string, sessionId: string, token:string}) :{accessToken:string, refreshToken:string} {
        return {
            accessToken: this.generateAccessToken(userId),
            refreshToken: this.generateRefreshToken({userId,sessionId, token}),
        }
    }
}
