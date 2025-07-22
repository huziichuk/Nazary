import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
	constructor(private readonly databaseService: DatabaseService) {}

	async findByEmail(email: string) {
		return this.databaseService.user.findUnique({ where: { email } });
	}

	async findById(id: string) {
		return this.databaseService.user.findUnique({ where: { id } });
	}

	async create(dto: CreateUserDto) {
		return this.databaseService.user.create({ data: dto });
	}

	async findByConfirmToken(token: string) {
		return this.databaseService.user.findFirst({
			where: { confirmToken: token },
		});
	}

	async update(user: User) {
		return this.databaseService.user.update({
			where: { id: user.id },
			data: user,
		});
	}
}
