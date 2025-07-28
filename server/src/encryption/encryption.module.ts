import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { EncryptionService } from './encryption.service';

@Module({
	providers: [EncryptionService],
	exports: [EncryptionService],
	imports: [DatabaseModule],
})
export class EncryptionModule {}
