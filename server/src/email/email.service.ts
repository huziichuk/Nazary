import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { EmailTemplateEnum } from '../types/general.types';
import { VerifyEmail } from '../emails/VerifyEmail';
import { render } from '@react-email/components';

@Injectable()
export class EmailService {
	private resend: Resend;

	constructor(private readonly configService: ConfigService) {
		this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
	}

	async sendEmail({
		to,
		subject,
		template,
		templateVariables = {},
	}: {
		to: string;
		subject: string;
		template: EmailTemplateEnum;
		templateVariables?: {
			userName?: string;
			verificationUrl?: string;
		};
	}) {
		try {
			const templates = {
				[EmailTemplateEnum.confirmEmail]: () => {
					if (
						!templateVariables.verificationUrl ||
						!templateVariables.userName
					) {
						throw new Error(
							'Missing template variables for confirmEmail',
						);
					}
					return render(
						VerifyEmail({
							userName: templateVariables.userName,
							verificationUrl: templateVariables.verificationUrl,
						}),
					);
				},
			};

			const templateFn = templates[template] as () => Promise<string>;
			if (typeof templateFn !== 'function') {
				throw new Error('Invalid email template');
			}
			const html: string = await templateFn();

			return await this.resend.emails.send({
				from: 'noreply@nazary.online',
				to,
				subject,
				html,
			});
		} catch (error) {
			if (error instanceof Error) {
				console.error('Error sending email:', error.message);
				throw error;
			} else {
				console.error('Unknown error sending email:', error);
				throw new Error('Unknown error');
			}
		}
	}
}
