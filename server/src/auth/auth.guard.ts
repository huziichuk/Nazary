import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import ms, { StringValue } from 'ms';
import AUTH_MESSAGES from '../constants/auth.messages';
import CONFIG_CONSTANTS from '../constants/config.constants';
import { SessionService } from '../session/session.service';
import {
	JwtAccessPayloadType,
	JwtRefreshPayloadType,
} from '../types/jwt.types';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly sessionService: SessionService,
		private readonly userService: UserService,
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();

		const cookies = request.cookies as Record<string, string>;

		const accessToken = cookies.accessToken || '';
		const refreshToken = cookies.refreshToken || '';

		if (!refreshToken) {
			throw new UnauthorizedException(AUTH_MESSAGES.ERROR.NO_TOKENS);
		}

		try {
			const decodedAccessToken: JwtAccessPayloadType = jwt.verify(
				accessToken,
				this.configService.get<string>(
					CONFIG_CONSTANTS.JWT_ACCESS_SECRET,
				) || CONFIG_CONSTANTS.JWT_ACCESS_SECRET,
			) as JwtAccessPayloadType;
			if (decodedAccessToken) {
				request['user'] = {
					id: decodedAccessToken.id,
					email: decodedAccessToken.email,
					salt: decodedAccessToken.salt,
					name: decodedAccessToken.name,
					createdAt: decodedAccessToken.createdAt,
				};
				request['sessionId'] = decodedAccessToken.sessionId;
				return true;
			}
		} catch {
			// If access token is invalid or expired, we will try to refresh it
		}
		try {
			const decodedRefreshToken: JwtRefreshPayloadType = jwt.verify(
				refreshToken,
				this.configService.get<string>(
					CONFIG_CONSTANTS.JWT_REFRESH_SECRET,
				) || CONFIG_CONSTANTS.JWT_REFRESH_SECRET,
			) as JwtRefreshPayloadType;

			if (decodedRefreshToken) {
				const user = await this.userService.findById(
					decodedRefreshToken.id,
				);
				if (!user)
					throw new UnauthorizedException(
						AUTH_MESSAGES.ERROR.WRONG_TOKENS,
					);
				const session = await this.sessionService.get(
					decodedRefreshToken.sessionId,
				);
				if (!session)
					throw new UnauthorizedException(
						AUTH_MESSAGES.ERROR.WRONG_TOKENS,
					);
				if (
					!bcrypt.compareSync(
						decodedRefreshToken.token,
						session.token,
					)
				)
					throw new UnauthorizedException(
						AUTH_MESSAGES.ERROR.WRONG_TOKENS,
					);
				if (session.expiresAt < new Date())
					throw new UnauthorizedException(
						AUTH_MESSAGES.ERROR.SESSION_EXPIRED,
					);
				const newAccessToken = this.authService.generateAccessToken(
					user,
					decodedRefreshToken.sessionId,
				);
				response.cookie('accessToken', newAccessToken, {
					httpOnly: true,
					secure: false,
					sameSite: 'lax',
					maxAge: ms(
						this.configService.get<StringValue>(
							CONFIG_CONSTANTS.JWT_ACCESS_EXPIRES_IN,
						) ?? '10m',
					),
				});
				request['user'] = user;
				request['sessionId'] = decodedRefreshToken.sessionId;
				return true;
			}
			return false;
		} catch (e) {
			console.error(e);
			if (e instanceof UnauthorizedException) {
				throw e;
			}
			throw new UnauthorizedException(AUTH_MESSAGES.ERROR.UNAUTHORIZED);
		}
	}
}
