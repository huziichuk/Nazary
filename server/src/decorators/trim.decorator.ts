import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export function Trim() {
	return applyDecorators(
		Transform(({ value }): string =>
			typeof value === 'string' ? value.trim() : value,
		),
	);
}
