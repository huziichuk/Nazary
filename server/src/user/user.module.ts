import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { UserService } from './user.service';

@Module({
	imports: [DatabaseModule],
	providers: [UserService, DatabaseService],
	exports: [UserService],
})
export class UserModule {}
