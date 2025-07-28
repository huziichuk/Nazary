import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto-js';
import { randomInt } from 'crypto';

@Injectable()
export class EncryptionService {
	private SHA_SECRET_KEY: string;
	private readonly saltRounds = 10;
	private pepper: string;

	constructor(private readonly configService: ConfigService) {
		this.SHA_SECRET_KEY = configService.get<string>('SECRET_KEY') as string;
		this.pepper = configService.get<string>('PEPPER') as string;
	}

	async hashPassword(password: string): Promise<string> {
		const passwordWithPepper = password + this.pepper;
		return bcrypt.hash(passwordWithPepper, this.saltRounds);
	}

	async comparePassword(password: string, hash: string): Promise<boolean> {
		const passwordWithPepper = password + this.pepper;
		return bcrypt.compare(passwordWithPepper, hash);
	}

	generate6DigitCode(): string {
		return randomInt(100000, 1000000).toString();
	}

	sha256(input: string): string {
		return crypto
			.HmacSHA256(input, this.SHA_SECRET_KEY)
			.toString(crypto.enc.Hex);
	}
}
