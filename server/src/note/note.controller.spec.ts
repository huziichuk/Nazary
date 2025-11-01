import { Test } from '@nestjs/testing';
import { AuthGuard } from 'src/auth/auth.guard';
import { SortNotesDto } from './dto/note.dto';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

describe('NoteController', () => {
	let controller: NoteController;

	const noteServiceMock = {
		create: jest.fn().mockResolvedValue({
			id: 'noteId',
			userId: 'userId',
			titleCipher: 'titleCipher',
			titleNonce: 'titleNonce',
			contentCipher: 'contentCipher',
			contentNonce: 'contentNonce',
			tagsCipher: 'tagsCipher',
			tagsNonce: 'tagsNonce',
			blindTokens: ['token1', 'token2'],
		}),
		findAll: jest.fn().mockResolvedValue([
			{
				id: 'noteId',
				userId: 'userId',
				titleCipher: 'titleCipher',
				titleNonce: 'titleNonce',
				contentCipher: 'contentCipher',
				contentNonce: 'contentNonce',
				tagsCipher: 'tagsCipher',
				tagsNonce: 'tagsNonce',
				blindTokens: ['token1', 'token2'],
			},
		]),
		find: jest.fn(),
	};

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [NoteController],
			providers: [{ provide: NoteService, useValue: noteServiceMock }],
		})
			.overrideGuard(AuthGuard)
			.useValue({ canActivate: () => true })
			.compile();

		controller = moduleRef.get(NoteController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('should create a note', async () => {
		const req: any = { user: { id: 'userId' } };
		const dto = {
			titleCipher: 'titleCipher',
			titleNonce: 'titleNonce',
			contentCipher: 'contentCipher',
			contentNonce: 'contentNonce',
			tagsCipher: 'tagsCipher',
			tagsNonce: 'tagsNonce',
			blindTokens: ['token1', 'token2'],
		};

		const result = await controller.create(req, dto);
		expect(result).toEqual({
			id: 'noteId',
			userId: 'userId',
			titleCipher: 'titleCipher',
			titleNonce: 'titleNonce',
			contentCipher: 'contentCipher',
			contentNonce: 'contentNonce',
			tagsCipher: 'tagsCipher',
			tagsNonce: 'tagsNonce',
			blindTokens: ['token1', 'token2'],
		});
		expect(noteServiceMock.create).toHaveBeenCalledWith('userId', dto);
	});

	it('should get notes', async () => {
		const req: any = { user: { id: 'userId' } };
		const sortNotesDto: SortNotesDto = {
			sortBy: 'created',
			order: 'desc',
			isFavorite: 'false',
		};

		const result = await controller.findAll(req, sortNotesDto);
		expect(result).toEqual([
			{
				id: 'noteId',
				userId: 'userId',
				titleCipher: 'titleCipher',
				titleNonce: 'titleNonce',
				contentCipher: 'contentCipher',
				contentNonce: 'contentNonce',
				tagsCipher: 'tagsCipher',
				tagsNonce: 'tagsNonce',
				blindTokens: ['token1', 'token2'],
			},
		]);
		expect(noteServiceMock.findAll).toHaveBeenCalledWith(
			'userId',
			sortNotesDto,
		);
	});
});
