import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { DatabaseService } from 'src/database/database.service';
import { EmailModule } from 'src/email/email.module';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { SessionModule } from 'src/session/session.module';
import { UserModule } from 'src/user/user.module';
import { VerificationCodeModule } from 'src/verification-code/verification-code.module';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
	providers: [NoteService, DatabaseService, JwtService, AuthService],
	controllers: [NoteController],
	imports: [
		AuthModule,
		JwtModule,
		SessionModule,
		UserModule,
		EncryptionModule,
		EmailModule,
		VerificationCodeModule,
	],
})
export class NoteModule {}
