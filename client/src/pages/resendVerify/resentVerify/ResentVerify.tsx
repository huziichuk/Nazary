import {
	ArrowRight,
	CheckCircle,
	Clock,
	ExternalLink,
	Mail,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from './ResentVerify.module.css'

type Props = {
	userEmail: string
}

const ResentVerify: React.FC<Props> = ({ userEmail }) => {
	const navigate = useNavigate()

	function handleOpenGmail(): void {
		throw new Error('Function not implemented.')
	}

	return (
		<div className={styles.resentPage}>
			<div className={styles.container}>
				<div className={styles.content}>
					<div className={styles.successSection}>
						<div className={styles.iconWrapper}>
							<div className={styles.successContainer}>
								<CheckCircle className={styles.successIcon} />
								<div className={styles.mailBadge}>
									<Mail className={styles.mailIcon} />
								</div>
							</div>
						</div>

						<h1 className={styles.title}>
							The email has been resent!
						</h1>
						<p className={styles.description}>
							We’ve sent a new confirmation email to{' '}
							<strong>{userEmail}</strong>. The previous link is
							now invalid.
						</p>
					</div>

					<div className={styles.timelineCard}>
						<h2 className={styles.timelineTitle}>
							What happens next:
						</h2>
						<div className={styles.timeline}>
							<div className={styles.timelineItem}>
								<div className={styles.timelineNumber}>1</div>
								<div className={styles.timelineContent}>
									<div className={styles.timelineLabel}>
										Now
									</div>
									<div className={styles.timelineText}>
										The email is being sent to your address
									</div>
								</div>
								<div className={styles.timelineStatus}>
									<div className={styles.statusDot}></div>
								</div>
							</div>
							<div className={styles.timelineItem}>
								<div className={styles.timelineNumber}>2</div>
								<div className={styles.timelineContent}>
									<div className={styles.timelineLabel}>
										In 1–5 minutes
									</div>
									<div className={styles.timelineText}>
										The email should arrive in your inbox
									</div>
								</div>
								<div className={styles.timelineStatus}>
									<Clock className={styles.statusIcon} />
								</div>
							</div>
							<div className={styles.timelineItem}>
								<div className={styles.timelineNumber}>3</div>
								<div className={styles.timelineContent}>
									<div className={styles.timelineLabel}>
										After clicking
									</div>
									<div className={styles.timelineText}>
										Your account will be verified
									</div>
								</div>
								<div className={styles.timelineStatus}>
									<ArrowRight className={styles.statusIcon} />
								</div>
							</div>
						</div>
					</div>

					<div className={styles.actions}>
						<button
							className={`${styles.button} ${styles.buttonPrimary}`}
							onClick={handleOpenGmail}
						>
							<Mail className={styles.icon} />
							Open Gmail
							<ExternalLink className={styles.iconSmall} />
						</button>
					</div>

					<div className={styles.helpSection}>
						<div className={styles.helpNote}>
							<div className={styles.helpIcon}>💡</div>
							<div className={styles.helpText}>
								<strong>Tip:</strong> Add noreply@nazary.com to
								your contacts so our emails don’t end up in
								spam.
							</div>
						</div>
					</div>

					<div className={styles.footer}>
						<button
							className={styles.backButton}
							onClick={() => navigate('/')}
						>
							← Back to Home
						</button>
					</div>
				</div>

				<div className={styles.illustration}>
					<div className={styles.deliveryAnimation}>
						<div className={styles.plane}>
							<div className={styles.planeBody}></div>
							<div className={styles.planeWing}></div>
							<Mail className={styles.planeIcon} />
						</div>
						<div className={styles.trail}>
							<div className={styles.trailDot}></div>
							<div className={styles.trailDot}></div>
							<div className={styles.trailDot}></div>
							<div className={styles.trailDot}></div>
						</div>
						<div className={styles.clouds}>
							<div className={styles.cloud}></div>
							<div className={styles.cloud}></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ResentVerify
