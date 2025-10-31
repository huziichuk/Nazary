import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { EncryptionService } from 'src/encryption/encryption.service';
import { VerificationCodeService } from './verification-code.service';

@Module({
	providers: [VerificationCodeService, DatabaseService, EncryptionService],
	imports: [DatabaseModule, EncryptionModule],
	exports: [VerificationCodeService],
})
export class VerificationCodeModule {}
