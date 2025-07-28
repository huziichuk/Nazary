import { pageConfig } from '@/pageConfig'
import { ArrowRight, CheckCircle, Home, Shield } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SuccessResetPassword.module.css'

const SuccessResetPassword: React.FC = () => {
	const navigate = useNavigate()

	return (
		<div className={styles.successPage}>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.successSection}>
						<div className={styles.iconWrapper}>
							<div className={styles.successContainer}>
								<CheckCircle className={styles.successIcon} />
								<div className={styles.shieldBadge}>
									<Shield className={styles.shieldIcon} />
								</div>
							</div>
						</div>

						<h1 className={styles.title}>
							Password successfully changed!
						</h1>
						<p className={styles.description}>
							Great! Your password has been updated successfully.
							You can now log in to your Nazary account using the
							new password.
						</p>
					</div>

					<div className={styles.securityCard}>
						<h2 className={styles.securityTitle}>
							Your account’s security:
						</h2>
						<div className={styles.securityList}>
							<div className={styles.securityItem}>
								<div className={styles.securityIcon}>
									<CheckCircle className={styles.checkIcon} />
								</div>
								<div className={styles.securityContent}>
									<div className={styles.securityLabel}>
										New password saved
									</div>
									<div className={styles.securityText}>
										Your password is encrypted and securely
										protected
									</div>
								</div>
							</div>
							<div className={styles.securityItem}>
								<div className={styles.securityIcon}>
									<CheckCircle className={styles.checkIcon} />
								</div>
								<div className={styles.securityContent}>
									<div className={styles.securityLabel}>
										All sessions terminated
									</div>
									<div className={styles.securityText}>
										You will be automatically signed out on
										all devices
									</div>
								</div>
							</div>
							<div className={styles.securityItem}>
								<div className={styles.securityIcon}>
									<CheckCircle className={styles.checkIcon} />
								</div>
								<div className={styles.securityContent}>
									<div className={styles.securityLabel}>
										Notification sent
									</div>
									<div className={styles.securityText}>
										A password change email has been sent to
										your inbox
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className={styles.actions}>
						<button
							className={`${styles.button} ${styles.buttonPrimary}`}
							onClick={() => navigate(pageConfig.login)}
						>
							<Home className={styles.icon} />
							Log in to your account
							<ArrowRight className={styles.iconSmall} />
						</button>
					</div>
				</div>

				<div className={styles.illustration}>
					<div className={styles.celebrationAnimation}>
						<div className={styles.successBadge}>
							<CheckCircle className={styles.badgeIcon} />
						</div>
						<div className={styles.confetti}>
							<div className={styles.confettiPiece}></div>
							<div className={styles.confettiPiece}></div>
							<div className={styles.confettiPiece}></div>
							<div className={styles.confettiPiece}></div>
							<div className={styles.confettiPiece}></div>
							<div className={styles.confettiPiece}></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SuccessResetPassword
