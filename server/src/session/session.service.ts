import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { SessionDto } from './dto/session.dto';
@Injectable()
export class SessionService {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(dto: SessionDto) {
		const hashedToken = bcrypt.hashSync(dto.token);
		return this.databaseService.session.create({
			data: { ...dto, token: hashedToken },
		});
	}

	async get(id: string) {
		return this.databaseService.session.findUnique({ where: { id } });
	}

	async delete(id: string) {
		console.log('sessionId:', id);
		return this.databaseService.session.delete({ where: { id } });
	}

	async deleteAll(userId: string) {
		return this.databaseService.session.deleteMany({ where: { userId } });
	}
}
