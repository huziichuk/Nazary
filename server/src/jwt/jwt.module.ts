import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import CONFIG_CONSTANTS from 'src/constants/config.constants';

@Module({
	imports: [
		NestJwtModule.registerAsync({
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
	exports: [NestJwtModule],
})
export class JwtConfigModule {}
