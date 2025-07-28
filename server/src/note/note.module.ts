import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

@Module({
	providers: [NoteService, DatabaseService],
	controllers: [NoteController],
})
export class NoteModule {}
