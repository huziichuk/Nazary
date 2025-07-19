import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import {DatabaseModule} from "../database/database.module";
import {DatabaseService} from "../database/database.service";

@Module({
  imports: [DatabaseModule],
  providers: [UserService, DatabaseService],
  exports: [UserService]
})
export class UserModule {}
