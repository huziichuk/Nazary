import { apiVerifyResetPassword } from '@/api/auth'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { ArrowLeft, Check, Clock, RefreshCw, Shield } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import styles from './VerifyResetPassword.module.css'

interface PasswordResetCodePageProps {
	email: string
	onSuccess: (code: string) => void
	back: () => void
	resendCode: () => void
}

const VerifyResetPassword = ({
	email,
	back,
	resendCode,
	onSuccess,
}: PasswordResetCodePageProps) => {
	const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
	const [timeLeft, setTimeLeft] = useState(600)
	const [error, setError] = useState<string | null>('')
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])

	const { mutate: verifyCode, isPending } = useMutation({
		mutationFn: (code: string) => apiVerifyResetPassword(code),
		onSuccess: () => {
			onSuccess(code.join(''))
		},
		onError: (e: unknown) => {
			if (e instanceof AxiosError) {
				setError('Wrong or expired code')
				return
			}
			setError('Some error occurred, please try again later')
		},
	})

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(prevTime => {
				if (prevTime <= 1) {
					clearInterval(timer)
					return 0
				}
				return prevTime - 1
			})
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`
	}

	const handleInputChange = (index: number, value: string) => {
		if (value.length > 1) return

		if (isNaN(Number(value))) return

		const newCode = [...code]
		newCode[index] = value
		setCode(newCode)

		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === 'Backspace' && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus()
		}
	}

	const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault()
		const fullCode = code.join('')
		if (fullCode.length !== 6) return
		verifyCode(fullCode)
	}

	const handleResendCode = () => {
		setTimeLeft(900)
		setCode(['', '', '', '', '', ''])
		inputRefs.current[0]?.focus()
		resendCode()
	}

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault()
		const pasted = e.clipboardData.getData('Text').trim()

		if (!/^\d{6}$/.test(pasted)) return
		const code = pasted.split('')
		setCode(code)

		inputRefs.current[length - 1]?.focus()
	}

	const isCodeComplete = code.every(digit => digit !== '')

	return (
		<div className={styles.codePage}>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.mainSection}>
						<div className={styles.iconWrapper}>
							<div className={styles.iconContainer}>
								<Shield className={styles.shieldIcon} />
							</div>
						</div>

						<h1 className={styles.title}>
							Enter Verification Code
						</h1>
						<p className={styles.description}>
							We sent a 6-digit code to <strong>{email}</strong>.
							Please enter it below to reset your password.
						</p>
					</div>

					<form
						className={styles.form}
						onSubmit={handleSubmit}
						onPaste={handlePaste}
					>
						{error ? (
							<p className={styles.apiError}>{error}</p>
						) : null}
						<div className={styles.codeInputGroup}>
							<label className={styles.label}>
								Verification Code
							</label>
							<div className={styles.codeInputs}>
								{code.map((digit, index) => (
									<input
										key={index}
										ref={(el: HTMLInputElement) => {
											inputRefs.current[index] = el
										}}
										type='text'
										inputMode='numeric'
										maxLength={1}
										value={digit}
										onChange={e =>
											handleInputChange(
												index,
												e.target.value
											)
										}
										onKeyDown={e => handleKeyDown(index, e)}
										className={styles.codeInput}
										autoComplete='off'
									/>
								))}
							</div>
						</div>

						<div className={styles.timerSection}>
							<Clock className={styles.timerIcon} />
							<span className={styles.timerText}>
								Code valid for:{' '}
								<strong>{formatTime(timeLeft)}</strong>
							</span>
						</div>

						<button
							type='submit'
							className={`${styles.button} ${styles.buttonPrimary}`}
							disabled={
								!isCodeComplete || isPending || timeLeft === 0
							}
						>
							{isPending ? (
								<>
									<div className={styles.spinner}></div>
									Verifying code...
								</>
							) : (
								<>
									<Check className={styles.icon} />
									Confirm Code
								</>
							)}
						</button>

						<button
							type='button'
							className={`${styles.button} ${styles.buttonOutline}`}
							onClick={handleResendCode}
							disabled={timeLeft > 0}
						>
							<RefreshCw className={styles.icon} />
							{timeLeft > 0
								? `Resend Code (${formatTime(timeLeft)})`
								: 'Resend Code'}
						</button>
					</form>

					<div className={styles.helpSection}>
						<div className={styles.helpText}>
							Didn't receive the code? Check your spam folder or
							wait up to 5 minutes.
						</div>
					</div>

					<div className={styles.footer}>
						<button className={styles.backButton} onClick={back}>
							<ArrowLeft className={styles.backIcon} />
							Back to password reset
						</button>
					</div>
				</div>

				<div className={styles.illustration}>
					<div className={styles.codeAnimation}>
						<div className={styles.codeDisplay}>
							{code.map((digit, index) => (
								<div key={index} className={styles.digitBox}>
									<span className={styles.digit}>
										{digit || '•'}
									</span>
									<div
										className={styles.digitUnderline}
									></div>
								</div>
							))}
						</div>
						<div className={styles.securityIndicator}>
							<div className={styles.securityRing}></div>
							<div className={styles.securityRing}></div>
							<Shield className={styles.securityIcon} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default VerifyResetPassword
