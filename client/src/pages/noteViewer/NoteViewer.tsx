import { apiToggleFavorite, apiUpdateNote } from '@/api/notes'
import { useMasterKey } from '@/hooks/useMasterKey'
import { useNoteEncrypted } from '@/hooks/useNote'
import { pageConfig } from '@/pageConfig'
import type { INote } from '@/types/noteTypes'
import { decryptNote, encryptNote } from '@/utils/encryptNote'
import TagSelector from '@/widgets/tagSelector/tagSelector'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Edit3, Eye, Heart, Save, Tag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './NoteViewer.module.css'

const NoteViewer = () => {
	const [note, setNote] = useState<INote | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [isPreviewMode, setIsPreviewMode] = useState(false)
	const [editTitle, setEditTitle] = useState('')
	const [editContent, setEditContent] = useState('')
	const [editTags, setEditTags] = useState<string[]>([])
	const [showTagSelector, setShowTagSelector] = useState(false)

	const navigate = useNavigate()

	const { id } = useParams<{ id: string }>()

	if (!id) {
		navigate(pageConfig.dashboard)
	}

	const qc = useQueryClient()

	const { data, isLoading } = useNoteEncrypted(id)

	const { masterKey } = useMasterKey()

	useEffect(() => {
		if (!masterKey) {
			navigate(pageConfig.dashboard)
			return
		}
		if (!isLoading && !data) {
			navigate(pageConfig.dashboard)
			return
		}
		if (data) {
			decryptNote(data, masterKey).then(decryptedNote => {
				setNote(decryptedNote)
				setEditContent(decryptedNote.content)
				setEditTitle(decryptedNote.title)
				setEditTags(decryptedNote.tags)
			})
		}
	}, [data, isLoading, masterKey, navigate])
	const handleSave = () => {
		if (!note) return
		if (!masterKey) return
		const updatedNote = {
			...note,
			title: editTitle,
			content: editContent,
			tags: editTags,
			updatedAt: new Date().toISOString(),
		}

		setNote(updatedNote)
		setIsEditing(false)
		setIsPreviewMode(false)
		encryptNote(updatedNote, masterKey).then(async encryptNote => {
			await apiUpdateNote(note.id, encryptNote)
			qc.invalidateQueries({ queryKey: ['notes'] })
		})
	}

	const handleCancel = () => {
		if (!note) return
		setEditTitle(note.title)
		setEditContent(note.content)
		setIsEditing(false)
		setIsPreviewMode(false)
	}

	const handleToggleFavorite = () => {
		if (!note) return
		apiToggleFavorite(note.id, !note.isFavorite)
		setNote(prev => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null))
	}

	const handleUpdateTags = (newTags: string[]) => {
		if (!note) return
		setEditTags(newTags)
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return new Intl.DateTimeFormat('en-EN', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(date)
	}

	if (!note) {
		return (
			<div className={styles.noteViewer}>
				<div className={styles.loading}>
					<div className={styles.spinner}></div>
					<p>Loading note...</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<article>
				<title>Note — Nazary</title>
			</article>
			<div className={styles.noteViewer}>
				<div className={styles.header}>
					<div className={styles.headerLeft}>
						<button
							className={styles.backButton}
							onClick={() => navigate(pageConfig.dashboard)}
						>
							<ArrowLeft className={styles.icon} />
							Back to notes
						</button>
					</div>

					<div className={styles.headerActions}>
						<button
							className={`${styles.actionButton} ${
								note.isFavorite ? styles.favorited : ''
							}`}
							onClick={handleToggleFavorite}
							title={
								note.isFavorite ? 'Remove from favorites' : 'Add to favorites'
							}
						>
							<Heart className={styles.icon} />
							{note.isFavorite ? 'In favorites' : 'Add to favorites'}
						</button>

						<button
							className={styles.actionButton}
							onClick={() => setShowTagSelector(true)}
						>
							<Tag className={styles.icon} />
							Tags
						</button>

						{isEditing ? (
							<div className={styles.editActions}>
								<button
									className={`${styles.actionButton} ${styles.cancelButton}`}
									onClick={handleCancel}
								>
									<X className={styles.icon} />
									Cancel
								</button>
								<button
									className={`${styles.actionButton} ${styles.saveButton}`}
									onClick={handleSave}
								>
									<Save className={styles.icon} />
									Save
								</button>
							</div>
						) : (
							<button
								className={`${styles.actionButton} ${styles.editButton}`}
								onClick={() => setIsEditing(true)}
							>
								<Edit3 className={styles.icon} />
								Edit
							</button>
						)}
					</div>
				</div>

				<div className={styles.content}>
					{isEditing ? (
						<div className={styles.editor}>
							<div className={styles.editorHeader}>
								<input
									type='text'
									value={editTitle}
									onChange={e => setEditTitle(e.target.value)}
									className={styles.titleInput}
									placeholder='Note title'
								/>
							</div>

							<div className={styles.editorBody}>
								<div className={styles.editorToolbar}>
									<button
										className={`${styles.previewButton} ${
											!isPreviewMode ? styles.active : ''
										}`}
										onClick={() => setIsPreviewMode(false)}
									>
										<Edit3 className={styles.icon} />
										Editor
									</button>
									<button
										className={`${styles.previewButton} ${
											isPreviewMode ? styles.active : ''
										}`}
										onClick={() => setIsPreviewMode(true)}
									>
										<Eye className={styles.icon} />
										Preview
									</button>
									<div className={styles.editorInfo}>
										Markdown syntax is supported
									</div>
								</div>

								{isPreviewMode ? (
									<div className={styles.previewContainer}>
										<div className={styles.previewHeader}>
											<h1 className={styles.previewTitle}>
												{editTitle || 'Untitled'}
											</h1>
										</div>
										<div className={styles.previewContent} />
										<ReactMarkdown>{editContent}</ReactMarkdown>
									</div>
								) : (
									<textarea
										value={editContent}
										onChange={e => setEditContent(e.target.value)}
										className={styles.contentTextarea}
										placeholder='Enter note content...'
									/>
								)}
							</div>
						</div>
					) : (
						<div className={styles.viewer}>
							<div className={styles.noteHeader}>
								<h1 className={styles.noteTitle}>{note.title}</h1>

								<div className={styles.noteMeta}>
									<div className={styles.metaItem}>
										<span className={styles.metaLabel}>Created:</span>
										<span className={styles.metaValue}>
											{formatDate(note.createdAt)}
										</span>
									</div>
									{note.updatedAt !== note.createdAt && (
										<div className={styles.metaItem}>
											<span className={styles.metaLabel}>Updated:</span>
											<span className={styles.metaValue}>
												{formatDate(note.updatedAt)}
											</span>
										</div>
									)}
								</div>

								{note.tags.length > 0 && (
									<div className={styles.tagsDisplay}>
										{note.tags.map((tag, index) => (
											<span key={index} className={styles.tag}>
												{tag}
											</span>
										))}
									</div>
								)}
							</div>

							<div className={styles.noteContent}>
								<ReactMarkdown>{note.content}</ReactMarkdown>
							</div>
						</div>
					)}
				</div>

				{showTagSelector && (
					<TagSelector
						selectedTags={editTags}
						onUpdateTags={(newTags: string[]) => {
							handleUpdateTags(newTags)
							setIsEditing(true)
						}}
						onClose={() => setShowTagSelector(false)}
					/>
				)}
			</div>
		</>
	)
}

export default NoteViewer
