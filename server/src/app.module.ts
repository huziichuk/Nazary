import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseService } from './database/database.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './session/session.module';
import { EmailModule } from './email/email.module';

@Module({
	imports: [
		AuthModule,
		UserModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		SessionModule,
		EmailModule,
	],
	controllers: [AppController],
	providers: [AppService, DatabaseService],
})
export class AppModule {}
