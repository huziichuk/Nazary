import {
	IsArray,
	IsBoolean,
	IsIn,
	IsOptional,
	IsString,
} from 'class-validator';
export class NoteDto {
	@IsString()
	titleCipher: string;

	@IsString()
	titleNonce: string;

	@IsString()
	contentCipher: string;

	@IsString()
	contentNonce: string;

	@IsString()
	tagsCipher: string;

	@IsString()
	tagsNonce: string;

	@IsArray()
	blindTokens: string[];
}

export class SortNotesDto {
	@IsOptional()
	@IsIn(['created', 'updated', 'title'])
	sortBy: 'created' | 'updated' | 'title' = 'created';

	@IsOptional()
	@IsIn(['asc', 'desc'])
	order: 'asc' | 'desc' = 'desc';

	@IsOptional()
	isFavorite: 'true' | 'false' = 'false';
}

export class SearchNoteDto {
	@IsArray()
	@IsString({ each: true })
	blindTokens: string[];
}

export class ToggleFavoriteNoteDto {
	@IsBoolean()
	status: boolean;
}
