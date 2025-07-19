import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import CONFIG_CONSTANTS from "../constants/config.constants";
import {SessionModule} from "../session/session.module";
import {AuthGuard} from "./auth.guard";

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard],
  imports: [UserModule,ConfigModule,SessionModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>(CONFIG_CONSTANTS.JWT_ACCESS_SECRET),
      signOptions: {
        expiresIn: configService.get<string>(CONFIG_CONSTANTS.JWT_ACCESS_EXPIRES_IN),
      }
    })
  })],
})
export class AuthModule {}
