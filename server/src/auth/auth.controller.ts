import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { LoginDto } from './dto/auth.dto';
import { Response } from 'express';
import AUTH_MESSAGES from '../constants/auth.messages';
import ms, { StringValue } from 'ms';
import { ConfigService } from '@nestjs/config';
import CONFIG_CONSTANTS from '../constants/config.constants';
import { AuthGuard } from './auth.guard';
import { SessionService } from '../session/session.service';
import { AuthRequest } from '../types/request.types';
import {
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import GENERAL_MESSAGES from '../constants/general.messages';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
		private readonly sessionService: SessionService,
	) {}

	@ApiOkResponse({ description: AUTH_MESSAGES.SUCCESS.REGISTERED })
	@ApiBadRequestResponse({
		description: AUTH_MESSAGES.ERROR.USER_ALREADY_EXISTS,
	})
	@ApiBadRequestResponse({ description: GENERAL_MESSAGES.ERROR.VALIDATION })
	@HttpCode(HttpStatus.CREATED)
	@Post('register')
	async register(@Body(new ValidationPipe()) dto: CreateUserDto) {
		await this.authService.register(dto);
		return { message: AUTH_MESSAGES.SUCCESS.REGISTERED };
	}

	@ApiOkResponse({ description: AUTH_MESSAGES.SUCCESS.LOGGED_IN })
	@ApiBadRequestResponse({ description: AUTH_MESSAGES.ERROR.USER_NOT_FOUND })
	@ApiBadRequestResponse({ description: AUTH_MESSAGES.ERROR.WRONG_PASSWORD })
	@ApiBadRequestResponse({ description: GENERAL_MESSAGES.ERROR.VALIDATION })
	@Post('login')
	async login(
		@Body(new ValidationPipe()) dto: LoginDto,
		@Res() res: Response,
	) {
		const { accessToken, refreshToken } = await this.authService.login(dto);

		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: ms(
				this.configService.get<StringValue>(
					CONFIG_CONSTANTS.JWT_ACCESS_EXPIRES_IN,
				) ?? '10m',
			),
		});
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: 'lax',
			maxAge: ms(
				this.configService.get<StringValue>(
					CONFIG_CONSTANTS.JWT_REFRESH_EXPIRES_IN,
				) ?? '30d',
			),
		});

		res.status(200).json({ message: AUTH_MESSAGES.SUCCESS.LOGGED_IN });
	}

	@ApiOkResponse({ description: AUTH_MESSAGES.SUCCESS.AUTHORIZED })
	@ApiUnauthorizedResponse({ description: AUTH_MESSAGES.ERROR.UNAUTHORIZED })
	@UseGuards(AuthGuard)
	@Get('is-auth')
	isAuth() {
		return { message: AUTH_MESSAGES.SUCCESS.AUTHORIZED };
	}

	@ApiOkResponse({ description: AUTH_MESSAGES.SUCCESS.LOGOUT })
	@ApiUnauthorizedResponse({ description: AUTH_MESSAGES.ERROR.UNAUTHORIZED })
	@UseGuards(AuthGuard)
	@Post('logout')
	async logout(@Res() res: Response, @Req() req: AuthRequest) {
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		await this.sessionService.delete(req.sessionId);
		res.status(200).json({ message: AUTH_MESSAGES.SUCCESS.LOGOUT });
	}
}
