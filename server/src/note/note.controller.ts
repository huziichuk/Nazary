import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthRequest } from 'src/types/request.types';
import {
	NoteDto,
	SearchNoteDto,
	SortNotesDto,
	ToggleFavoriteNoteDto,
} from './dto/note.dto';
import { NoteService } from './note.service';

@Controller('notes')
export class NoteController {
	constructor(private readonly noteService: NoteService) {}

	@Post()
	@UseGuards(AuthGuard)
	create(
		@Req() req: AuthRequest,
		@Body(new ValidationPipe({ whitelist: true })) dto: NoteDto,
	) {
		const userId = req.user.id;
		return this.noteService.create(userId, dto);
	}

	@Put(':id')
	@UseGuards(AuthGuard)
	async updateNote(
		@Req() req: AuthRequest,
		@Param('id') id: string,
		@Body(new ValidationPipe({ whitelist: true })) dto: NoteDto,
	) {
		return await this.noteService.updateNote(id, req.user.id, dto);
	}

	@Get()
	@UseGuards(AuthGuard)
	async findAll(
		@Req() req: AuthRequest,
		@Query(new ValidationPipe({ transform: true })) dto: SortNotesDto,
	) {
		return this.noteService.findAll(req.user.id, dto);
	}

	@Get(':id')
	@UseGuards(AuthGuard)
	async getNote(@Req() req: AuthRequest, @Param('id') id: string) {
		return this.noteService.find(req.user.id, id);
	}

	@Post('search')
	@UseGuards(AuthGuard)
	async search(
		@Req() req: AuthRequest,
		@Body(new ValidationPipe()) dto: SearchNoteDto,
		@Query(new ValidationPipe({ transform: true })) sortDto: SortNotesDto,
	) {
		const notes = await this.noteService.findByBlindTokens(
			req.user.id,
			dto,
			sortDto,
		);

		return notes;
	}

	@Delete(':id')
	@UseGuards(AuthGuard)
	async deleteNote(@Req() req: AuthRequest, @Param('id') id: string) {
		await this.noteService.delete(req.user.id, id);
		HttpCode(204);
	}

	@Patch(':id/favorite')
	@UseGuards(AuthGuard)
	async toggleFavorite(
		@Req() req: AuthRequest,
		@Param('id') id: string,
		@Body(new ValidationPipe()) dto: ToggleFavoriteNoteDto,
	) {
		await this.noteService.toggleFavorite(req.user.id, id, dto.status);
	}
}
