import { apiSetNewPassword } from '@/api/auth'
import ValidationError from '@/components/ValidationError'
import type { INewPasswordDto } from '@/types/authTypes'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ArrowLeft, Check, Eye, EyeOff, Lock, Shield } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './NewResetPassword.module.css'

type Props = {
	code: string
	onSuccess: () => void
	back: () => void
}

const NewResetPassword: React.FC<Props> = ({ code, back, onSuccess }) => {
	const [error, setError] = useState<string | null>('')
	const [showPasswords, setShowPasswords] = useState({
		new: false,
		confirm: false,
	})

	const { register, handleSubmit, formState, watch } =
		useForm<INewPasswordDto>({
			mode: 'onChange',
		})

	const { mutate: setNewPassword, isPending } = useMutation({
		mutationFn: (dto: INewPasswordDto) =>
			apiSetNewPassword({ ...dto, code }),
		onSuccess: () => {
			onSuccess()
		},
		onError: (e: unknown) => {
			if (e instanceof AxiosError) {
				setError(e.response?.data.message as string)
			}
		},
	})

	const onSubmit = async (dto: INewPasswordDto) => {
		setNewPassword(dto)
	}

	const togglePasswordVisibility = (field: 'new' | 'confirm') => {
		setShowPasswords(prev => ({
			...prev,
			[field]: !prev[field],
		}))
	}

	const newPassword = watch('newPassword')

	return (
		<div className={styles.newPasswordPage}>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.mainSection}>
						<div className={styles.iconWrapper}>
							<div className={styles.iconContainer}>
								<Lock className={styles.lockIcon} />
								<div className={styles.keyBadge}>
									<Shield className={styles.keyIcon} />
								</div>
							</div>
						</div>

						<h1 className={styles.title}>Create a new password</h1>
						<p className={styles.description}>
							Set a new secure password for your Nazary account.
							Make sure it is different from your previous
							passwords.
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
							<label
								htmlFor='newPassword'
								className={styles.label}
							>
								New Password
							</label>
							<div className={styles.inputWrapper}>
								<Lock className={styles.inputIcon} />
								<input
									id='newPassword'
									type={
										showPasswords.new ? 'text' : 'password'
									}
									placeholder='Enter new password'
									className={styles.input}
									{...register('newPassword', {
										required: 'Password is required',
										validate: {
											minLength: (value: string) =>
												value.length >= 8 ||
												'Password must be at least 8 characters',
											maxLength: (value: string) =>
												value.length <= 50 ||
												'Password must not exceed 50 characters',
											hasUpperCase: (value: string) =>
												/[A-Z]/.test(value) ||
												'Password must contain an uppercase letter',
											hasNumber: (value: string) =>
												/\d/.test(value) ||
												'Password must contain a number',
										},
										setValueAs: (v: string): string =>
											v.trim() || '',
									})}
								/>
								<button
									type='button'
									className={styles.toggleButton}
									onClick={() =>
										togglePasswordVisibility('new')
									}
								>
									{showPasswords.new ? (
										<EyeOff className={styles.eyeIcon} />
									) : (
										<Eye className={styles.eyeIcon} />
									)}
								</button>
							</div>
							<ValidationError
								className={styles.error}
								error={formState.errors.newPassword?.message}
							/>
						</div>

						<div className={styles.inputGroup}>
							<label
								htmlFor='confirmPassword'
								className={styles.label}
							>
								Confirm Password
							</label>
							<div className={styles.inputWrapper}>
								<Lock className={styles.inputIcon} />
								<input
									id='confirmPassword'
									type={
										showPasswords.confirm
											? 'text'
											: 'password'
									}
									placeholder='Repeat new password'
									className={styles.input}
									{...register('confirmNewPassword', {
										required:
											'Password confirm is required',
										validate: {
											passwordMatch: (value: string) =>
												value === newPassword ||
												'Passwords must match',
										},
										setValueAs: (v: string): string =>
											v.trim() || '',
									})}
								/>
								<button
									type='button'
									className={styles.toggleButton}
									onClick={() =>
										togglePasswordVisibility('confirm')
									}
								>
									{showPasswords.confirm ? (
										<EyeOff className={styles.eyeIcon} />
									) : (
										<Eye className={styles.eyeIcon} />
									)}
								</button>
							</div>
							<ValidationError
								className={styles.error}
								error={
									formState.errors.confirmNewPassword?.message
								}
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
									Saving password...
								</>
							) : (
								<>
									<Check className={styles.icon} />
									Save password
								</>
							)}
						</button>
					</form>

					<div className={styles.footer}>
						<button
							className={styles.backButton}
							onClick={() => {
								back()
							}}
						>
							<ArrowLeft className={styles.backIcon} />
							Back to code confirmation
						</button>
					</div>
				</div>

				<div className={styles.illustration}>
					<div className={styles.securityAnimation}>
						<div className={styles.lockContainer}>
							<div className={styles.lockBody}>
								<Lock className={styles.lockMainIcon} />
							</div>
						</div>
						<div className={styles.securityParticles}>
							<div className={styles.particle}></div>
							<div className={styles.particle}></div>
							<div className={styles.particle}></div>
							<div className={styles.particle}></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NewResetPassword
