import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { JwtConfigModule } from 'src/jwt/jwt.module';
import { VerificationCodeModule } from 'src/verification-code/verification-code.module';
import { VerificationCodeService } from 'src/verification-code/verification-code.service';
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
		JwtConfigModule,
		EncryptionModule,
		VerificationCodeModule,
		UserModule,
		DatabaseModule,
		ConfigModule,
		SessionModule,
		EncryptionModule,
		EmailModule,
	],
})
export class AuthModule {}
