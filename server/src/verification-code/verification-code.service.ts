import { Injectable } from '@nestjs/common';
import { CodeType } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { EncryptionService } from './../encryption/encryption.service';

@Injectable()
export class VerificationCodeService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly encryptionService: EncryptionService,
	) {}
	createVerificationCode({
		userId,
		type,
		code,
	}: {
		userId: string;
		code: string;
		type: CodeType;
	}) {
		const encryptedCode = this.encryptionService.sha256(code);
		return this.databaseService.verificationCode.create({
			data: {
				userId,
				type,
				code: encryptedCode,
				expiresAt: new Date(Date.now() + 30 * 60 * 1000),
			},
		});
	}

	async isUserHaveCode(userId: string, codeType: CodeType): Promise<boolean> {
		const codeObject =
			await this.databaseService.verificationCode.findFirst({
				where: {
					type: codeType,
					userId,
					expiresAt: {
						gt: new Date(),
					},
				},
			});

		return !!codeObject;
	}

	async getVerificationCode(code: string) {
		const encryptedCode = this.encryptionService.sha256(code);
		return this.databaseService.verificationCode.findUnique({
			where: {
				code: encryptedCode,
			},
		});
	}

	async deleteVerificationCode(id: string) {
		await this.databaseService.verificationCode.delete({
			where: {
				id,
			},
		});
	}
}
