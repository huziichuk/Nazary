import { apiResendVerification } from '@/api/auth'
import ValidationError from '@/components/ValidationError'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Info, Mail, Send } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import styles from './ResendVerify.module.css'
import ResentVerify from './resentVerify/ResentVerify'
import type { IRequestResetPasswordDto } from '@/types/authTypes'

const ResendVerify: React.FC = () => {
	const [error, setError] = React.useState<string | null>(null)

	const { register, handleSubmit, getValues, formState } =
		useForm<IRequestResetPasswordDto>({
			mode: 'onChange',
		})

	const {
		mutate: ResendVerify,
		isPending,
		isSuccess,
	} = useMutation({
		mutationFn: (email: string) => apiResendVerification(email),
		onError: (error: unknown) => {
			if (error instanceof AxiosError) {
				setError(
					error.response?.data.message ||
						'An error occurred while sending the email.'
				)
				return
			}
			setError('An unexpected error occurred. Please try again later.')
		},
	})

	const onSubmit = (data: IRequestResetPasswordDto) => {
		ResendVerify(data.email)
	}

	if (isSuccess) {
		return <ResentVerify userEmail={getValues('email')} />
	}

	return (
		<>
			<article>
				<title>Resend Verification Email — Nazary</title>
			</article>
			<div className={styles.resendPage}>
				<div className={styles.container}>
					<div className={styles.content}>
						<div className={styles.mainSection}>
							<div className={styles.iconWrapper}>
								<Mail className={styles.mailIcon} />
							</div>

							<h1 className={styles.title}>
								Resend Confirmation Email
							</h1>
							<p className={styles.description}>
								Enter your email address and we'll send you a
								new confirmation email. Please make sure the
								email is entered correctly.
							</p>
						</div>

						<form
							className={styles.form}
							onSubmit={handleSubmit(onSubmit)}
						>
							{error ? (
								<p className={styles.apiError}>{error}</p>
							) : null}
							<div className={styles.inputGroup}>
								<label htmlFor='email' className={styles.label}>
									Email Address
								</label>
								<div className={styles.inputWrapper}>
									<Mail className={styles.inputIcon} />
									<input
										placeholder='your@email.com'
										className={styles.input}
										{...register('email', {
											required: 'Email is required',
											pattern: {
												value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
												message: 'Invalid email',
											},
										})}
									/>
								</div>
								<ValidationError
									error={formState.errors.email?.message}
									className={styles.error}
								/>
							</div>

							<button
								type='submit'
								className={`${styles.button} ${styles.buttonPrimary}`}
								disabled={!formState.isValid || isPending}
							>
								{isPending ? (
									<>
										<div className={styles.spinner}></div>
										Sending...
									</>
								) : (
									<>
										<Send className={styles.icon} />
										Send Email
									</>
								)}
							</button>
						</form>

						<div className={styles.infoCard}>
							<Info className={styles.infoIcon} />
							<div className={styles.infoContent}>
								<div className={styles.infoTitle}>
									Important Information:
								</div>
								<div className={styles.infoText}>
									• The email may take up to 5 minutes to
									arrive
									<br />
									• Check your "Spam" or "Promotions" folder
									<br />• A new link will invalidate the
									previous one
								</div>
							</div>
						</div>
					</div>

					<div className={styles.illustration}>
						<div className={styles.emailSendAnimation}>
							<div className={styles.envelopeContainer}>
								<div className={styles.envelope}>
									<div className={styles.envelopeFlap}></div>
									<div className={styles.envelopeBody}></div>
									<Mail className={styles.envelopeIcon} />
								</div>
								<div className={styles.sendPath}>
									<div className={styles.pathDot}></div>
									<div className={styles.pathDot}></div>
									<div className={styles.pathDot}></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ResendVerify
