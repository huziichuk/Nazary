import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {SessionService} from "../session/session.service";
import {Request, Response} from "express";
import AUTH_MESSAGES from "../constants/auth.messages";
import {UserService} from "../user/user.service";
import {JwtAccessPayloadType, JwtRefreshPayloadType} from "../types/jwt.types";
import jwt from "jsonwebtoken";
import {ConfigService} from "@nestjs/config";
import CONFIG_CONSTANTS from "../constants/config.constants";
import {AuthService} from "./auth.service";
import ms, {StringValue} from "ms";
import bcrypt from "bcryptjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly sessionService: SessionService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        const accessToken = request.cookies.accessToken || null;
        const refreshToken = request.cookies.refreshToken || null;

        if (!refreshToken) {
            throw new UnauthorizedException(AUTH_MESSAGES.ERROR.NO_TOKENS);
        }

        try {
            const decodedAccessToken: JwtAccessPayloadType = this.jwtService.verify(accessToken);
            if (decodedAccessToken) {
                return true;
            }
        } catch {
        }
        try {
            const decodedRefreshToken: JwtRefreshPayloadType = jwt.verify(refreshToken, this.configService.get<string>(CONFIG_CONSTANTS.JWT_REFRESH_SECRET) || CONFIG_CONSTANTS.JWT_REFRESH_SECRET) as JwtRefreshPayloadType;

            if (decodedRefreshToken) {
                const user = await this.userService.findById(decodedRefreshToken.userId);
                if (!user) throw new UnauthorizedException(AUTH_MESSAGES.ERROR.WRONG_TOKENS)
                const session = await this.sessionService.get(decodedRefreshToken.sessionId)
                if (!session) throw new UnauthorizedException(AUTH_MESSAGES.ERROR.WRONG_TOKENS)
                if(!bcrypt.compareSync(decodedRefreshToken.token, session.token)) throw new UnauthorizedException(AUTH_MESSAGES.ERROR.WRONG_TOKENS)
                if (session.expiresAt < new Date()) throw new UnauthorizedException(AUTH_MESSAGES.ERROR.SESSION_EXPIRED)
                const newAccessToken = this.authService.generateAccessToken(user.id)
                response.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: ms(this.configService.get<StringValue>(CONFIG_CONSTANTS.JWT_ACCESS_EXPIRES_IN) ?? "10m"),
                });
                request["user"] = user
                request["sessionId"] = session.id
                return true
            }
            return false
        } catch (e) {
            console.error(e);
            if (e instanceof UnauthorizedException) {
                throw e;
            }
            throw new UnauthorizedException(AUTH_MESSAGES.ERROR.UNAUTHORIZED);
        }
    }
}