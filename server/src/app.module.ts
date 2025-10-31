import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseService } from './database/database.service';
import { EmailModule } from './email/email.module';
import { EncryptionModule } from './encryption/encryption.module';
import { JwtConfigModule } from './jwt/jwt.module';
import { NoteModule } from './note/note.module';
import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';
import { VerificationCodeModule } from './verification-code/verification-code.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		UserModule,
		SessionModule,
		EmailModule,
		NoteModule,
		VerificationCodeModule,
		EncryptionModule,
		JwtConfigModule,
	],
	controllers: [AppController],
	providers: [AppService, DatabaseService],
})
export class AppModule {}
