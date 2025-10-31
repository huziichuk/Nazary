import ValidationError from '@/components/ValidationError.tsx'
import { useAuth } from '@/hooks/useAuth'
import { useLogin } from '@/hooks/useLogin.ts'
import { useMasterKey } from '@/hooks/useMasterKey'
import { pageConfig } from '@/pageConfig'
import type { ILoginDto } from '@/types/authTypes.ts'
import { AxiosError } from 'axios'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NavLink, useNavigate } from 'react-router-dom'
import Loading from '../loading/Loading'
import styles from './Auth.module.css'

const LoginForm = () => {
	const [showPassword, setShowPassword] = useState(false)

	const { login } = useLogin()

	const [error, setError] = useState<string | null>(null)
	const { register, handleSubmit, formState } = useForm<ILoginDto>({
		mode: 'onChange',
	})

	const navigate = useNavigate()

	const { isAuthenticated, isLoading } = useAuth()
	const { masterKey } = useMasterKey()

	useEffect(() => {
		if (isAuthenticated && !!masterKey) navigate(pageConfig.dashboard)
	}, [isAuthenticated, masterKey, navigate])

	if (isLoading) return <Loading />

	const onSubmit = (data: ILoginDto) => {
		setError(null)
		login(data, {
			onError: (e: unknown) => {
				console.log(e)
				if (e instanceof AxiosError) {
					const message = Array.isArray(e.response?.data.message)
						? e.response?.data.message[0]
						: e.response?.data.message
					setError(message || 'Login failed')
				} else {
					setError('Some error occurred, please try again later.')
				}
			},
		})
	}

	return (
		<>
			<article>
				<title>Login — Nazary</title>
			</article>
			<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
				{error ? <p className={styles.apiError}>{error}</p> : null}
				<div className={styles.inputGroup}>
					<label htmlFor='email' className={styles.label}>
						Email
					</label>
					<div className={styles.inputWrapper}>
						<Mail className={styles.inputIcon} />
						<input
							className={styles.input}
							placeholder='your@email.com'
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: 'Invalid email address',
								},
								setValueAs: (v: string): string => v.trim() || '',
							})}
						/>
					</div>
					<ValidationError
						className={styles.error}
						error={formState.errors.email?.message}
					/>
				</div>

				<div className={styles.inputGroup}>
					<label htmlFor='password' className={styles.label}>
						Password
					</label>
					<div className={styles.inputWrapper}>
						<Lock className={styles.inputIcon} />
						<input
							type={showPassword ? 'text' : 'password'}
							className={styles.input}
							placeholder='Enter password'
							{...register('password', {
								required: 'Password is required',
								setValueAs: (v: string): string => v.trim() || '',
							})}
						/>
						<button
							type='button'
							className={styles.togglePassword}
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<EyeOff className={styles.icon} />
							) : (
								<Eye className={styles.icon} />
							)}
						</button>
					</div>
					<ValidationError
						className={styles.error}
						error={formState.errors.password?.message}
					/>
				</div>

				<div className={styles.forgotPassword}>
					<NavLink to={pageConfig.resetPassword} className={styles.forgotLink}>
						Forgot password?
					</NavLink>
				</div>

				<button type='submit' className={styles.submitButton}>
					Log In
				</button>
			</form>
		</>
	)
}

export default LoginForm
