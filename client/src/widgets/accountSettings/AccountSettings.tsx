import { useAuth } from '@/hooks/useAuth'
import { useFormatDate } from '@/hooks/useFormatDate'
import {
	AlertTriangle,
	Eye,
	EyeOff,
	Key,
	Lock,
	LogOut,
	Shield,
	Trash2,
	User,
} from 'lucide-react'
import { useState } from 'react'
import ConfirmationModal from '../confirmationModal/ConfirmationModal'
import styles from './AccountSettings.module.css'

const AccountSettings = () => {
	const [showChangePassword, setShowChangePassword] = useState(false)
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const [showLogoutModal, setShowLogoutModal] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [deleteConfirmText, setDeleteConfirmText] = useState('')

	const [isChangingPassword] = useState(false)
	const [isLoggingOut] = useState(false)

	const { user } = useAuth()

	const handleChangePassword = async () => {
		//TODO password change logic
	}

	const handleLogoutAllDevices = async () => {}
	//TODO logout all devices

	const handleDeleteAccount = async () => {
		//TODO delete account
	}

	const isPasswordValid =
		newPassword.length >= 8 && newPassword === confirmPassword

	return (
		<div className={styles.settingsContainer}>
			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<User className={styles.sectionIcon} />
					<div>
						<h3 className={styles.sectionTitle}>Profile</h3>
						<p className={styles.sectionDescription}>
							Account main information management
						</p>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.profileInfo}>
						<div className={styles.avatar}>
							<User className={styles.avatarIcon} />
						</div>
						<div className={styles.userInfo}>
							<h4 className={styles.userName}>{user?.email}</h4>
							<p className={styles.userRole}>
								Member since{' '}
								{useFormatDate(user?.createdAt, {
									month: 'long',
									day: 'numeric',
									year: 'numeric',
								})}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<Shield className={styles.sectionIcon} />
					<div>
						<h3 className={styles.sectionTitle}>Security</h3>
						<p className={styles.sectionDescription}>
							Security settings and password management
						</p>
					</div>
				</div>

				<div className={styles.card}>
					<div className={styles.settingItem}>
						<div className={styles.settingInfo}>
							<div className={styles.settingHeader}>
								<Lock className={styles.settingIcon} />
								<div>
									<h4 className={styles.settingTitle}>Change password</h4>
									<p className={styles.settingDescription}>
										Update your password to ensure account security
									</p>
								</div>
							</div>
						</div>

						<button
							className={styles.actionButton}
							onClick={() => setShowChangePassword(!showChangePassword)}
						>
							<Key className={styles.buttonIcon} />
							{showChangePassword ? 'Cancel' : 'Change password'}
						</button>
					</div>

					{showChangePassword && (
						<div className={styles.changePasswordForm}>
							<div className={styles.formGroup}>
								<label className={styles.label}>Current password</label>
								<div className={styles.passwordInput}>
									<input
										type={showCurrentPassword ? 'text' : 'password'}
										value={currentPassword}
										onChange={e => setCurrentPassword(e.target.value)}
										className={styles.input}
										placeholder='Enter current password'
									/>
									<button
										type='button'
										className={styles.togglePassword}
										onClick={() => setShowCurrentPassword(!showCurrentPassword)}
									>
										{showCurrentPassword ? <EyeOff /> : <Eye />}
									</button>
								</div>
							</div>

							<div className={styles.formGroup}>
								<label className={styles.label}>New password</label>
								<div className={styles.passwordInput}>
									<input
										type={showNewPassword ? 'text' : 'password'}
										value={newPassword}
										onChange={e => setNewPassword(e.target.value)}
										className={styles.input}
										placeholder='Enter new password'
									/>
									<button
										type='button'
										className={styles.togglePassword}
										onClick={() => setShowNewPassword(!showNewPassword)}
									>
										{showNewPassword ? <EyeOff /> : <Eye />}
									</button>
								</div>
							</div>

							<div className={styles.formGroup}>
								<label className={styles.label}>Confirm new password</label>
								<div className={styles.passwordInput}>
									<input
										type={showConfirmPassword ? 'text' : 'password'}
										value={confirmPassword}
										onChange={e => setConfirmPassword(e.target.value)}
										className={styles.input}
										placeholder='Repeat new password'
									/>
									<button
										type='button'
										className={styles.togglePassword}
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									>
										{showConfirmPassword ? <EyeOff /> : <Eye />}
									</button>
								</div>
							</div>

							<div className={styles.formActions}>
								<button
									className={`${styles.submitButton} ${
										!isPasswordValid ? styles.disabled : ''
									}`}
									onClick={handleChangePassword}
									disabled={!isPasswordValid || isChangingPassword}
								>
									{isChangingPassword ? 'Changing...' : 'Save password'}
								</button>
							</div>
						</div>
					)}

					<div className={styles.divider} />

					<div className={styles.settingItem}>
						<div className={styles.settingInfo}>
							<div className={styles.settingHeader}>
								<LogOut className={styles.settingIcon} />
								<div>
									<h4 className={styles.settingTitle}>
										Log out from all devices
									</h4>
									<p className={styles.settingDescription}>
										End all active sessions on other devices
									</p>
								</div>
							</div>
						</div>

						<button
							className={`${styles.actionButton} ${styles.warningButton}`}
							onClick={() => setShowLogoutModal(true)}
						>
							<LogOut className={styles.buttonIcon} />
							Log out everywhere
						</button>
					</div>
				</div>
			</section>

			{/* Danger zone */}
			<section className={styles.section}>
				<div className={styles.sectionHeader}>
					<AlertTriangle className={styles.sectionIcon} />
					<div>
						<h3 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>
							Danger zone
						</h3>
						<p className={styles.sectionDescription}>
							Irreversible actions with your account
						</p>
					</div>
				</div>

				<div className={`${styles.card} ${styles.dangerCard}`}>
					<div className={styles.settingItem}>
						<div className={styles.settingInfo}>
							<div className={styles.settingHeader}>
								<Trash2
									className={`${styles.settingIcon} ${styles.dangerIcon}`}
								/>
								<div>
									<h4
										className={`${styles.settingTitle} ${styles.dangerTitle}`}
									>
										Delete account
									</h4>
									<p className={styles.settingDescription}>
										Permanently delete your account and all associated notes
									</p>
								</div>
							</div>
						</div>

						<button
							className={`${styles.actionButton} ${styles.dangerButton}`}
							onClick={() => setShowDeleteModal(true)}
						>
							<Trash2 className={styles.buttonIcon} />
							Delete account
						</button>
					</div>
				</div>
			</section>

			<ConfirmationModal
				isOpen={showLogoutModal}
				onClose={() => setShowLogoutModal(false)}
				onConfirm={handleLogoutAllDevices}
				title='Log out from all devices?'
				message='This action will end all active sessions on all devices. You will need to sign in again.'
				confirmText={isLoggingOut ? 'Logging out...' : 'Log out everywhere'}
				type='warning'
			/>

			<ConfirmationModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDeleteAccount}
				title='Delete account?'
				message='This action will permanently delete your account and all notes. Recovery will be impossible.'
				confirmText='Delete permanently'
				type='danger'
				requireTextConfirmation='DELETE'
				textConfirmationValue={deleteConfirmText}
				onTextConfirmationChange={setDeleteConfirmText}
			/>
		</div>
	)
}

export default AccountSettings
