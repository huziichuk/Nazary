import { Injectable } from '@nestjs/common';
import { DatabaseService } from './../database/database.service';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

@Injectable()
export class NoteService {
	constructor(private readonly databaseService: DatabaseService) {}

	async createNote(dto: CreateNoteDto, userId: string) {
		const tags = dto.tags?.length
			? await Promise.all(
					dto.tags.map((name: string) =>
						this.databaseService.tag.upsert({
							where: { name },
							update: {},
							create: { name },
						}),
					),
				)
			: [];

		return this.databaseService.note.create({
			data: {
				title: dto.title,
				content: dto.content,
				userId,
				tags: {
					connect: tags.map((tag) => ({ id: tag.id })),
				},
			},
			include: { tags: true },
		});
	}
	async getUserNotesTitle(userId: string) {
		return this.databaseService.note.findMany({
			where: { userId },
			select: { id: true, title: true, createdAt: true },
			orderBy: { createdAt: 'desc' },
		});
	}

	async getNoteById(id: string) {
		return this.databaseService.note.findUnique({
			where: { id },
			include: { tags: true },
		});
	}

	async updateNote(id: string, dto: UpdateNoteDto) {
		const tags = dto.tags?.length
			? await Promise.all(
					dto.tags.map((name: string) =>
						this.databaseService.tag.upsert({
							where: { name },
							update: {},
							create: { name },
						}),
					),
				)
			: [];

		return this.databaseService.note.update({
			where: { id },
			data: {
				title: dto.title,
				content: dto.content,
				tags: {
					set: tags.map((tag) => ({ id: tag.id })),
				},
			},
			include: { tags: true },
		});
	}
}
