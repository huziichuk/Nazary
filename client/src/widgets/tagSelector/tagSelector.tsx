import { Plus, Tag, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './tagSelector.module.css'

interface TagSelectorProps {
	selectedTags: string[]
	onUpdateTags: (tags: string[]) => void
	onClose: () => void
}

const TagSelector = ({
	selectedTags,
	onUpdateTags,
	onClose,
}: TagSelectorProps) => {
	const [newTag, setNewTag] = useState('')
	const [tempSelectedTags, setTempSelectedTags] =
		useState<string[]>(selectedTags)

	useEffect(() => setTempSelectedTags(selectedTags), [selectedTags])

	const handleRemoveTag = useCallback((tag: string) => {
		setTempSelectedTags(prev => prev.filter(t => t !== tag))
	}, [])

	const handleAddTag = useCallback(() => {
		const tagToAdd = newTag.trim()
		if (tagToAdd && !tempSelectedTags.includes(tagToAdd)) {
			setTempSelectedTags(prev => [...prev, tagToAdd])
			setNewTag('')
		}
	}, [newTag, tempSelectedTags])

	const handleSave = useCallback(() => {
		onUpdateTags(tempSelectedTags)
		onClose()
	}, [onUpdateTags, onClose, tempSelectedTags])

	const handleCancel = useCallback(() => {
		setTempSelectedTags(selectedTags)
		onClose()
	}, [onClose, selectedTags])

	const addRef = useRef(handleAddTag)
	const cancelRef = useRef(handleCancel)
	useEffect(() => {
		addRef.current = handleAddTag
		cancelRef.current = handleCancel
	})

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') cancelRef.current()
			else if (e.key === 'Enter') addRef.current()
		}
		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, []) // зависимостей нет — варна не будет

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddTag()
		}
	}

	return (
		<div className={styles.overlay} onClick={handleCancel}>
			<div className={styles.modal} onClick={e => e.stopPropagation()}>
				<div className={styles.header}>
					<div className={styles.title}>
						<Tag className={styles.icon} />
						Manage Tags
					</div>
					<button className={styles.closeButton} onClick={handleCancel}>
						<X className={styles.icon} />
					</button>
				</div>

				<div className={styles.content}>
					<div className={styles.section}>
						<div className={styles.sectionTitle}>Selected tags</div>
						<div className={styles.selectedTags}>
							{tempSelectedTags.length === 0 ? (
								<div className={styles.emptyState}>No tags selected</div>
							) : (
								tempSelectedTags.map(tag => (
									<span key={tag} className={styles.selectedTag}>
										{tag}
										<button
											className={styles.removeTag}
											onClick={() => handleRemoveTag(tag)}
										>
											<X className={styles.removeIcon} />
										</button>
									</span>
								))
							)}
						</div>
					</div>

					<div className={styles.section}>
						<div className={styles.sectionTitle}>Add a new tag</div>
						<div className={styles.createTagForm}>
							<input
								type='text'
								value={newTag}
								onChange={e => setNewTag(e.target.value)}
								onKeyDown={handleInputKeyDown} // вместо onKeyPress
								placeholder='Enter tag name...'
								className={styles.newTagInput}
								autoFocus
							/>
							<button
								className={styles.createConfirmButton}
								onClick={handleAddTag}
								disabled={!newTag.trim()}
							>
								<Plus className={styles.icon} />
							</button>
						</div>
					</div>
				</div>

				<div className={styles.footer}>
					<button className={styles.cancelButton} onClick={handleCancel}>
						Cancel
					</button>
					<button className={styles.saveButton} onClick={handleSave}>
						Save ({tempSelectedTags.length})
					</button>
				</div>
			</div>
		</div>
	)
}

export default TagSelector
