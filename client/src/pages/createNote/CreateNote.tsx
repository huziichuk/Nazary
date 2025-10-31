import { useCreateNote } from '@/hooks/useCreateNote'
import { useMasterKey } from '@/hooks/useMasterKey'
import { pageConfig } from '@/pageConfig'
import { encryptNote } from '@/utils/encryptNote'
import TagInput from '@/widgets/tagInput/TagInput'
import { AxiosError } from 'axios'
import { ArrowLeft, Eye, EyeOff, Save } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CreateNote.module.css'

const NoteCreator: React.FC = () => {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [tags, setTags] = useState('')
	const [isPreview, setIsPreview] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const titleRef = useRef<HTMLInputElement>(null)

	const navigate = useNavigate()

	const { masterKey } = useMasterKey()

	const createNote = useCreateNote()

	useEffect(() => {
		if (titleRef.current) {
			titleRef.current.focus()
		}
	}, [])

	useEffect(() => {
		const hasChanges =
			title.trim() !== '' || content.trim() !== '' || tags.trim() !== ''
		setHasUnsavedChanges(hasChanges)
	}, [title, content, tags])

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		}
	}, [content])

	const handleSave = async () => {
		if (!title.trim()) {
			alert('Пожалуйста, введите название заметки')
			titleRef.current?.focus()
			return
		}

		setIsSaving(true)

		const filteredTags = tags
			.trim()
			.split(' ')
			.map(tag => tag.trim().replace(/^#/, ''))
			.filter(tag => tag.length > 0)

		const noteData = {
			title: title.trim(),
			content: content.trim(),
			tags: filteredTags,
		}

		if (!masterKey) return

		const encryptedNote = await encryptNote(noteData, masterKey)

		try {
			createNote.mutate(encryptedNote)
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				console.log(e)
			}
		}

		setIsSaving(false)
	}

	const handleCancel = () => {
		if (hasUnsavedChanges) {
			if (
				confirm(
					'You have unsaved changes. Are you sure you want to cancel note creation?'
				)
			) {
				navigate(pageConfig.dashboard)
			}
		} else {
			navigate(pageConfig.dashboard)
		}
	}

	return (
		<div className={styles.creatorContainer}>
			<div className={styles.creatorPage}>
				<div className={styles.header}>
					<div className={styles.headerLeft}>
						<button className={styles.backButton} onClick={handleCancel}>
							<ArrowLeft className={styles.icon} />
							Back
						</button>

						<div className={styles.headerText}>
							<h1 className={styles.pageTitle}>Create Note</h1>
							{hasUnsavedChanges && (
								<span className={styles.unsavedIndicator}>Unsaved changes</span>
							)}
						</div>
					</div>

					<div className={styles.headerActions}>
						<button
							className={styles.previewButton}
							onClick={() => setIsPreview(!isPreview)}
						>
							{isPreview ? (
								<EyeOff className={styles.icon} />
							) : (
								<Eye className={styles.icon} />
							)}
							{isPreview ? 'Edit' : 'Preview'}
						</button>

						<button
							className={styles.saveButton}
							onClick={handleSave}
							disabled={!title.trim() || isSaving}
						>
							<Save className={styles.icon} />
							{isSaving ? 'Saving...' : 'Save'}
						</button>
					</div>
				</div>

				<div className={styles.editorContainer}>
					<div className={styles.titleSection}>
						<input
							ref={titleRef}
							type='text'
							value={title}
							onChange={e => setTitle(e.target.value)}
							placeholder='Enter note title...'
							className={styles.titleInput}
							disabled={isPreview}
						/>
					</div>

					<div className={styles.tagsSection}>
						<TagInput
							value={tags}
							onChange={setTags}
							placeholder='Add tags using # (e.g. #work #ideas #project)'
							disabled={isPreview}
						/>
					</div>

					<div className={styles.contentSection}>
						{isPreview ? (
							<div className={styles.previewContent}>
								{content ? content : 'Content will appear here'}
							</div>
						) : (
							<textarea
								ref={textareaRef}
								value={content}
								onChange={e => setContent(e.target.value)}
								placeholder='Start writing your note... Markdown supported'
								className={styles.contentTextarea}
							/>
						)}
					</div>
				</div>

				<div className={styles.footer}>
					<div className={styles.footerLeft}>
						<span className={styles.markdownHint}>
							Markdown supported: **bold**, *italic*, # headers, - [ ]
							checklists
						</span>
					</div>

					<div className={styles.footerRight}>
						<span className={styles.wordCount}>
							{content.length} characters
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NoteCreator
