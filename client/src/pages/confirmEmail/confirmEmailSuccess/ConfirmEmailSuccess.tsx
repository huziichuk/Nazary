import React from 'react'
import styles from '@/pages/confirmEmail/confirmEmailSuccess/ConfirmEmailSuccess.module.css'
import { ArrowRight, CheckCircle, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { pageConfig } from '@/pageConfig'

const ConfirmEmailSuccess: React.FC = () => {
	const navigate = useNavigate()

	return (
		<>
			<article>
				<title>Confirm Your Email — Nazary</title>
			</article>
			<div className={styles.verifiedPage}>
				<div className={styles.container}>
					<div className={styles.content}>
						<div className={styles.successSection}>
							<div className={styles.iconWrapper}>
								<CheckCircle className={styles.successIcon} />
							</div>
							<h1 className={styles.title}>
								Email successfully verified!
							</h1>
							<p className={styles.description}>
								Great! Your email address has been successfully
								verified. You can now fully enjoy all the
								features of Nazary.
							</p>
						</div>

						<div className={styles.features}>
							<h2 className={styles.featuresTitle}>
								What’s available to you now:
							</h2>
							<div className={styles.featuresList}>
								<div className={styles.featureItem}>
									<div className={styles.featureDot}></div>
									<span>Create and save notes</span>
								</div>
								<div className={styles.featureItem}>
									<div className={styles.featureDot}></div>
									<span>Organize notes with tags</span>
								</div>
								<div className={styles.featureItem}>
									<div className={styles.featureDot}></div>
									<span>Fast content search</span>
								</div>
								<div className={styles.featureItem}>
									<div className={styles.featureDot}></div>
									<span>Cross-device synchronization</span>
								</div>
							</div>
						</div>

						<div className={styles.actions}>
							<button
								className={`${styles.button} ${styles.buttonPrimary}`}
								onClick={() => navigate(pageConfig.login)}
							>
								Get started
								<ArrowRight className={styles.icon} />
							</button>
							<button
								className={`${styles.button} ${styles.buttonOutline}`}
								onClick={() => navigate(pageConfig.home)}
							>
								Go to homepage
							</button>
						</div>

						<div className={styles.footer}>
							<div className={styles.emailInfo}>
								<Mail className={styles.emailIcon} />
								<span>
									Notification emails will be sent to your
									verified address
								</span>
							</div>
						</div>
					</div>

					<div className={styles.illustration}>
						<div className={styles.animatedSuccess}></div>
						<div className={styles.particles}>
							<div className={styles.particle}></div>
							<div className={styles.particle}></div>
							<div className={styles.particle}></div>
							<div className={styles.particle}></div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default ConfirmEmailSuccess
