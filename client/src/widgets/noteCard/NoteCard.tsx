import { apiDeleteNote, apiToggleFavorite } from '@/api/notes'
import { useFormatDate } from '@/hooks/useFormatDate'
import { useQueryClient } from '@tanstack/react-query'
import { Calendar, Eye, Heart, MoreVertical, Tag, Trash2 } from 'lucide-react'
import { useState } from 'react'
import ConfirmationModal from '../confirmationModal/ConfirmationModal'
import styles from './NoteCard.module.css'

interface Note {
	id: string
	title: string
	content: string
	tags: string[]
	createdAt: string
	updatedAt: string
	isFavorite: boolean
}

interface NoteCardProps {
	note: Note
	onView: () => void
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onView }) => {
	const [showMenu, setShowMenu] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)

	const onToggleFavorite = async () => {
		await apiToggleFavorite(note.id, !note.isFavorite)
		qc.invalidateQueries({ queryKey: ['notes'] })
	}

	const getPreviewText = (content: string, maxLength: number = 120) => {
		if (content.length <= maxLength) return content
		return content.substring(0, maxLength) + '...'
	}

	const qc = useQueryClient()

	const handleDeleteClick = () => {
		setShowDeleteModal(true)
		setShowMenu(false)
	}

	const handleConfirmDelete = async () => {
		setShowDeleteModal(false)
		await apiDeleteNote(note.id)
		qc.invalidateQueries({ queryKey: ['notes'] })
	}

	return (
		<>
			<div className={styles.noteCard}>
				<div className={styles.cardHeader}>
					<h3 className={styles.noteTitle} onClick={onView}>
						{note.title}
					</h3>

					<div className={styles.cardActions}>
						<button
							className={`${styles.actionButton} ${styles.favoriteButton} ${
								note.isFavorite ? styles.favorited : ''
							}`}
							onClick={onToggleFavorite}
							title={
								note.isFavorite ? 'Remove from favorites' : 'Add to favorites'
							}
						>
							<Heart className={styles.actionIcon} />
						</button>

						<div className={styles.menuContainer}>
							<button
								className={styles.actionButton}
								onClick={() => setShowMenu(!showMenu)}
							>
								<MoreVertical className={styles.actionIcon} />
							</button>

							{showMenu && (
								<div className={styles.dropdownMenu}>
									<button className={styles.menuItem} onClick={onView}>
										<Eye className={styles.menuIcon} />
										Open
									</button>
									<button
										className={`${styles.menuItem} ${styles.deleteMenuItem}`}
										onClick={handleDeleteClick}
									>
										<Trash2 className={styles.menuIcon} />
										Delete
									</button>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className={styles.cardContent}>
					<p className={styles.notePreview} onClick={onView}>
						{getPreviewText(note.content, 120)}
					</p>
				</div>

				<div className={styles.cardFooter}>
					<div className={styles.tags}>
						{note.tags.slice(0, 3).map((tag, index) => (
							<span key={index} className={styles.tag}>
								<Tag className={styles.tagIcon} />
								{tag}
							</span>
						))}
						{note.tags.length > 3 && (
							<span className={styles.tagMore}>+{note.tags.length - 3}</span>
						)}
					</div>

					<div className={styles.metadata}>
						<div className={styles.date}>
							<Calendar className={styles.dateIcon} />
							{useFormatDate(note.createdAt)}
						</div>

						<div className={styles.actions}>
							<button
								className={`${styles.actionButton} ${styles.viewButton}`}
								onClick={onView}
								title='Open note'
							>
								<Eye className={styles.actionIcon} />
							</button>

							<button
								className={`${styles.actionButton} ${styles.deleteButton}`}
								onClick={handleDeleteClick}
								title='Delete note'
							>
								<Trash2 className={styles.actionIcon} />
							</button>
						</div>
					</div>
				</div>

				{showMenu && (
					<div
						className={styles.menuOverlay}
						onClick={() => setShowMenu(false)}
					/>
				)}
			</div>

			<ConfirmationModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleConfirmDelete}
				title='Delete note?'
				message={`The note "${note.title}" will be permanently deleted. This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	)
}

export default NoteCard
