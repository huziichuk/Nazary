import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from './../database/database.service';
import { NoteDto, SearchNoteDto, SortNotesDto } from './dto/note.dto';

@Injectable()
export class NoteService {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(userId: string, dto: NoteDto) {
		return this.databaseService.note.create({
			data: {
				userId,
				titleCipher: dto.titleCipher,
				titleNonce: dto.titleNonce,
				contentCipher: dto.contentCipher,
				contentNonce: dto.contentNonce,
				tagsCipher: dto.tagsCipher,
				tagsNonce: dto.tagsNonce,
				blindTokens: dto.blindTokens,
			},
		});
	}

	async updateNote(id: string, userId: string, dto: NoteDto) {
		const updated = await this.databaseService.note.update({
			where: { id, userId },
			data: dto,
		});

		if (!updated) {
			throw new NotFoundException('Note not found');
		}

		return updated;
	}

	async findByBlindTokens(
		userId: string,
		dto: SearchNoteDto,
		sortDto: SortNotesDto,
	) {
		return this.databaseService.note.findMany({
			where: {
				userId,
				blindTokens: {
					hasSome: dto.blindTokens,
				},
			},
			orderBy:
				sortDto.sortBy === 'created'
					? { createdAt: sortDto.order }
					: sortDto.sortBy === 'updated'
						? { updatedAt: sortDto.order }
						: { titleCipher: sortDto.order },
		});
	}

	async findAll(userId: string, dto: SortNotesDto) {
		if (dto.isFavorite === 'true') {
			return this.databaseService.note.findMany({
				where: { userId, isFavorite: true },
				orderBy:
					dto.sortBy === 'created'
						? { createdAt: dto.order }
						: dto.sortBy === 'updated'
							? { updatedAt: dto.order }
							: { titleCipher: dto.order },
			});
		}
		return this.databaseService.note.findMany({
			where: { userId },
			orderBy:
				dto.sortBy === 'created'
					? { createdAt: dto.order }
					: dto.sortBy === 'updated'
						? { updatedAt: dto.order }
						: { titleCipher: dto.order },
		});
	}

	async find(userId: string, id: string) {
		return this.databaseService.note.findUnique({
			where: { id, userId },
		});
	}

	async delete(userId: string, id: string) {
		const note = await this.databaseService.note.findFirst({
			where: { id, userId },
		});
		if (!note) throw new NotFoundException('Note not found');
		await this.databaseService.note.delete({ where: { id } });
	}

	async toggleFavorite(userId: string, id: string, status: boolean) {
		const updated = await this.databaseService.note.updateMany({
			where: { id, userId },
			data: { isFavorite: status },
		});

		if (updated.count === 0) {
			throw new NotFoundException('Note not found');
		}
	}
}
