import { Hash, X } from 'lucide-react'
import { useState } from 'react'
import styles from './TagInput.module.css'

interface TagInputProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	disabled?: boolean
}

const TagInput = ({
	value,
	onChange,
	placeholder,
	disabled = false,
}: TagInputProps) => {
	const [isFocused, setIsFocused] = useState(false)

	const parseTags = (text: string): string[] => {
		const tagMatches = text.match(/#\w+/g)
		return tagMatches ? tagMatches.map(tag => tag.slice(1)) : []
	}

	const highlightTags = (text: string) => {
		if (!text) return null

		const parts = []
		const regex = /#\w+/g
		let lastIndex = 0
		let match

		while ((match = regex.exec(text)) !== null) {
			if (match.index > lastIndex) {
				parts.push(
					<span key={`text-${lastIndex}`} className={styles.normalText}>
						{text.slice(lastIndex, match.index)}
					</span>
				)
			}

			parts.push(
				<span key={`tag-${match.index}`} className={styles.highlightedTag}>
					{match[0]}
				</span>
			)

			lastIndex = match.index + match[0].length
		}

		if (lastIndex < text.length) {
			parts.push(
				<span key={`text-${lastIndex}`} className={styles.normalText}>
					{text.slice(lastIndex)}
				</span>
			)
		}

		return parts
	}

	const tags = parseTags(value)
	const hasText = value.length > 0
	const highlightedContent = highlightTags(value)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value)
	}

	const handleFocus = () => {
		setIsFocused(true)
	}

	const handleBlur = () => {
		setIsFocused(false)
	}

	const removeTag = (tagToRemove: string) => {
		const newValue = value
			.replace(new RegExp(`#${tagToRemove}\\b`, 'g'), '')
			.replace(/\s+/g, ' ')
			.trim()
		onChange(newValue)
	}

	return (
		<div
			className={`${styles.tagInputWrapper} ${
				isFocused ? styles.focused : ''
			} ${disabled ? styles.disabled : ''}`}
		>
			<div className={styles.inputSection}>
				<div className={styles.inputContainer}>
					<input
						type='text'
						value={value}
						onChange={handleInputChange}
						onFocus={handleFocus}
						onBlur={handleBlur}
						placeholder={placeholder}
						disabled={disabled}
						className={styles.input}
					/>

					{hasText && (
						<div className={styles.highlightOverlay}>{highlightedContent}</div>
					)}
				</div>

				<div className={styles.inputHint}>
					Use <strong>#</strong> to create tags (e.g. <code>#work #ideas</code>)
				</div>
			</div>

			{tags.length > 0 && (
				<div className={styles.tagsSection}>
					<div className={styles.tagsHeader}>
						<Hash className={styles.hashIcon} />
						<span className={styles.tagsCount}>Tags ({tags.length})</span>
					</div>
					<div className={styles.tagsList}>
						{tags.map((tag, index) => (
							<div key={`${tag}-${index}`} className={styles.tagChip}>
								<span className={styles.tagText}>{tag}</span>
								<button
									type='button'
									className={styles.removeTagButton}
									onClick={() => removeTag(tag)}
									disabled={disabled}
								>
									<X className={styles.removeIcon} />
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default TagInput
