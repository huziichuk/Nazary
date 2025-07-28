import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/database/database.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { VerificationCodeModule } from 'src/verification-code/verification-code.module';
import { VerificationCodeService } from 'src/verification-code/verification-code.service';
import CONFIG_CONSTANTS from '../constants/config.constants';
import { EmailModule } from '../email/email.module';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
	controllers: [AuthController],
	providers: [AuthService, AuthGuard, VerificationCodeService],
	exports: [AuthGuard],
	imports: [
		EncryptionModule,
		VerificationCodeModule,
		UserModule,
		DatabaseModule,
		ConfigModule,
		SessionModule,
		EncryptionModule,
		EmailModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>(
					CONFIG_CONSTANTS.JWT_ACCESS_SECRET,
				),
				signOptions: {
					expiresIn: configService.get<string>(
						CONFIG_CONSTANTS.JWT_ACCESS_EXPIRES_IN,
					),
				},
			}),
		}),
	],
})
export class AuthModule {}
