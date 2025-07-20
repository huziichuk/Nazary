import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { DatabaseModule } from '../database/database.module';

@Module({
	providers: [SessionService],
	exports: [SessionService],
	imports: [DatabaseModule],
})
export class SessionModule {}
