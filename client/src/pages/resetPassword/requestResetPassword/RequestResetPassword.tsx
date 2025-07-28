import { apiRequestResetPassword } from '@/api/auth'
import ValidationError from '@/components/ValidationError'
import { pageConfig } from '@/pageConfig'
import type { IRequestResetPasswordDto } from '@/types/authTypes'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ArrowLeft, Info, Mail, Send, Shield } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import styles from './RequestResetPassword.module.css'

type Props = {
	onSuccess: (email: string) => void
}

const RequestResetPassword: React.FC<Props> = ({ onSuccess }) => {
	const [error, setError] = useState<string | null>(null)

	const { register, handleSubmit, formState, getValues } =
		useForm<IRequestResetPasswordDto>()

	const { mutate: requestResetPassword, isPending } = useMutation({
		mutationFn: (email: string) => apiRequestResetPassword(email),
		onSuccess: () => {
			onSuccess(getValues('email'))
		},
		onError: (e: unknown) => {
			if (e instanceof AxiosError) {
				setError(e.response?.data.message)
			}
		},
	})

	const onSubmit = (data: IRequestResetPasswordDto) => {
		requestResetPassword(data.email)
	}

	const navigate = useNavigate()

	return (
		<>
			<article>
				<title>Reset Password - Nazary</title>
			</article>
			<div className={styles.resetPage}>
				<div className={styles.container}>
					<div className={styles.content}>
						<div className={styles.mainSection}>
							<div className={styles.iconWrapper}>
								<div className={styles.iconContainer}>
									<Shield className={styles.shieldIcon} />
									<Mail className={styles.mailBadge} />
								</div>
							</div>

							<h1 className={styles.title}>Reset Password</h1>
							<p className={styles.description}>
								Forgot your password? Don’t worry! Enter your
								email address and we’ll send you a code to reset
								your password.
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
										id='email'
										placeholder='your@email.com'
										className={styles.input}
										{...register('email', {
											required: 'Email is required',
											pattern: {
												value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
												message:
													'Invalid email address',
											},
											setValueAs: (v: string): string =>
												v.trim() || '',
										})}
									/>
								</div>
								<ValidationError
									className={styles.error}
									error={formState.errors.email?.message}
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
										Sending code...
									</>
								) : (
									<>
										<Send className={styles.icon} />
										Send Code
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
									• The code is valid for 10 minutes
									<br />
									• Check your "Spam" folder if the email
									doesn't arrive
									<br />• Use only the email associated with
									your account
								</div>
							</div>
						</div>

						<div className={styles.helpSection}>
							<div className={styles.helpText}>
								Remember your password?
								<button
									className={styles.linkButton}
									onClick={() => navigate(pageConfig.login)}
								>
									Log in to your account
								</button>
							</div>
						</div>

						<div className={styles.footer}>
							<button
								className={styles.backButton}
								onClick={() => navigate(pageConfig.login)}
							>
								<ArrowLeft className={styles.backIcon} />
								Back to login
							</button>
						</div>
					</div>

					<div className={styles.illustration}>
						<div className={styles.securityAnimation}>
							<div className={styles.shield}>
								<Shield className={styles.shieldMainIcon} />
								<div className={styles.securityRings}>
									<div className={styles.ring}></div>
									<div className={styles.ring}></div>
									<div className={styles.ring}></div>
								</div>
							</div>
							<div className={styles.lockElements}>
								<div className={styles.lockDot}></div>
								<div className={styles.lockDot}></div>
								<div className={styles.lockDot}></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default RequestResetPassword
