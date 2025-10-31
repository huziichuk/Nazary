import { AlertTriangle, Key, LogOut, Trash2, X } from 'lucide-react'
import styles from './ConfirmationModal.module.css'

interface ConfirmationModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title: string
	message: string
	confirmText: string
	type: 'danger' | 'warning' | 'info'
	requireTextConfirmation?: string
	textConfirmationValue?: string
	onTextConfirmationChange?: (value: string) => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText,
	type,
	requireTextConfirmation,
	textConfirmationValue,
	onTextConfirmationChange,
}) => {
	if (!isOpen) return null

	const getIcon = () => {
		switch (type) {
			case 'danger':
				return <Trash2 className={styles.icon} />
			case 'warning':
				return <LogOut className={styles.icon} />
			case 'info':
				return <Key className={styles.icon} />
			default:
				return <AlertTriangle className={styles.icon} />
		}
	}

	const isConfirmDisabled = !!(
		requireTextConfirmation && textConfirmationValue !== requireTextConfirmation
	)

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div
				className={`${styles.modal} ${styles[type]}`}
				onClick={e => e.stopPropagation()}
			>
				<div className={styles.header}>
					<div className={styles.iconContainer}>{getIcon()}</div>
					<button className={styles.closeButton} onClick={onClose}>
						<X className={styles.closeIcon} />
					</button>
				</div>

				<div className={styles.content}>
					<h3 className={styles.title}>{title}</h3>
					<p className={styles.message}>{message}</p>

					{requireTextConfirmation && (
						<div className={styles.textConfirmation}>
							<label className={styles.confirmationLabel}>
								Enter <strong>{requireTextConfirmation}</strong> to confirm:
							</label>
							<input
								type='text'
								value={textConfirmationValue || ''}
								onChange={e => onTextConfirmationChange?.(e.target.value)}
								className={styles.confirmationInput}
								placeholder={requireTextConfirmation}
							/>
						</div>
					)}
				</div>

				<div className={styles.actions}>
					<button className={styles.cancelButton} onClick={onClose}>
						Cancel
					</button>
					<button
						className={`${styles.confirmButton} ${styles[type]}`}
						onClick={onConfirm}
						disabled={isConfirmDisabled}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ConfirmationModal
