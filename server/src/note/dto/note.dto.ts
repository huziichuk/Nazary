import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Trim } from 'src/decorators/trim.decorator';

export class CreateNoteDto {
	@ApiProperty()
	@MaxLength(256)
	@IsString()
	@Trim()
	@IsNotEmpty()
	title: string;

	@ApiProperty()
	@MaxLength(10000)
	@IsString()
	content: string;

	@ApiProperty({ required: false })
	@IsString({ each: true })
	tags?: string[];
}

export type UpdateNoteDto = Partial<CreateNoteDto>;
