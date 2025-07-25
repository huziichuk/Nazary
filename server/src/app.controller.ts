import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@ApiOkResponse({ description: 'Hello World!' })
	@Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
