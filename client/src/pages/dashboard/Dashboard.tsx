import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useMasterKey } from '@/hooks/useMasterKey'
import { useNotesEncrypted } from '@/hooks/useNotes'
import { useSearchNotes } from '@/hooks/useSearchNotes'
import { pageConfig } from '@/pageConfig'
import type { INote, order, sortBy } from '@/types/noteTypes'
import { generateBlindTokens } from '@/utils/cryptoUtils'
import { decryptNote } from '@/utils/encryptNote'
import AccountSettings from '@/widgets/accountSettings/AccountSettings'
import AccountSidebar from '@/widgets/accountSidebar/AccountSidebar'
import NoteCard from '@/widgets/noteCard/NoteCard'
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	Hash,
	Plus,
	Search,
	X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.css'

function Dashboard() {
	const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'settings'>(
		'all'
	)
	const [notes, setNotes] = useState<INote[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [sortBy, setSortBy] = useState<sortBy>('created')
	const [blindTokens, setBlindTokens] = useState<string[]>([])
	const [sortOrder, setSortOrder] = useState<order>('desc')
	const [showTagSuggestions, setShowTagSuggestions] = useState(false)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	const navigate = useNavigate()

	const { data: searchEncryptNotes } = useSearchNotes({
		blindTokens,
		sortBy,
		isFavorite: activeTab === 'favorites',
		order: sortOrder,
	})
	const { data: encryptNotes } = useNotesEncrypted({
		sortBy,
		isFavorite: activeTab === 'favorites',
		order: sortOrder,
	})

	const { masterKey } = useMasterKey()

	const encSource = blindTokens.length > 0 ? searchEncryptNotes : encryptNotes

	useEffect(() => {
		if (!encSource || !masterKey) {
			setNotes([])
			return
		}
		let cancelled = false
		;(async () => {
			const out = await Promise.all(
				encSource.map(async n => {
					const note = await decryptNote(n, masterKey)
					return note
				})
			)
			if (!cancelled) setNotes(out)
		})()
		return () => {
			cancelled = true
		}
	}, [encSource, masterKey, sortBy, sortOrder])

	const dq = useDebouncedValue(searchQuery.trim(), 300)

	const allTags = useMemo(
		() => Array.from(new Set(notes.flatMap(note => note.tags))).sort(),
		[notes]
	)

	const parseSearchQuery = (query: string) => {
		const tagRegex = /#(\w+)/g
		const tags: string[] = []
		let match

		while ((match = tagRegex.exec(query)) !== null) {
			tags.push(match[1].toLowerCase())
		}

		const textQuery = query === '#' ? '' : query.replace(/#\w+/g, '').trim()

		return { tags, textQuery }
	}

	const { tags: searchTags, textQuery } = useMemo(
		() => parseSearchQuery(dq),
		[dq]
	)

	useEffect(() => {
		let cancelled = false
		;(async () => {
			if (searchTags.length === 0 && !textQuery) {
				setBlindTokens([])
				return
			}
			const tokens = await generateBlindTokens(textQuery, searchTags)
			if (!cancelled) setBlindTokens(tokens)
		})()
		return () => {
			cancelled = true
		}
	}, [searchTags, textQuery])

	const getTagSuggestions = () => {
		const lastTag = searchQuery.split('#').pop()?.toLowerCase() || ''
		if (!lastTag) return allTags.slice(0, 5)

		return allTags
			.filter(
				tag =>
					tag.toLowerCase().includes(lastTag) &&
					!searchTags.includes(tag.toLowerCase())
			)
			.slice(0, 5)
	}

	const getSortSelectOptions = () => {
		const isAsc = sortOrder === 'asc'

		return [
			{
				value: 'created',
				label:
					sortBy === 'created'
						? isAsc
							? 'Creation date: old → new'
							: 'Creation date: new → old'
						: 'By creation date',
			},
			{
				value: 'updated',
				label:
					sortBy === 'updated'
						? isAsc
							? 'Update date: old → new'
							: 'Update date: new → old'
						: 'By update date',
			},
		]
	}

	const handleSearchInputChange = (value: string) => {
		setSearchQuery(value)
		setShowTagSuggestions(value.includes('#'))
	}

	const handleTagSuggestionClick = (tag: string) => {
		const lastHashIndex = searchQuery.lastIndexOf('#')
		if (lastHashIndex !== -1) {
			const beforeHash = searchQuery.substring(0, lastHashIndex)
			setSearchQuery(`${beforeHash}#${tag} `)
		} else {
			setSearchQuery(`${searchQuery} #${tag} `)
		}
		setShowTagSuggestions(false)
	}

	const removeSearchTag = (tagToRemove: string) => {
		const newQuery = searchQuery
			.replace(new RegExp(`#${tagToRemove}\\b`, 'gi'), '')
			.replace(/\s+/g, ' ')
			.trim()
		setSearchQuery(newQuery)
	}

	const handleSortChange = (newSortBy: string) => {
		if (newSortBy === sortBy) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
		} else {
			setSortBy(newSortBy as 'created' | 'updated')
		}
	}

	const toggleSortOrder = () => {
		setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
	}

	return (
		<>
			<article>
				<title>
					{activeTab === 'all'
						? 'All Notes — Nazary'
						: activeTab === 'favorites'
						? 'Favorite Notes — Nazary'
						: activeTab === 'settings'
						? 'Settings — Nazary'
						: null}
				</title>
			</article>
			<div className={styles.accountPage}>
				<AccountSidebar
					activeTab={activeTab}
					isMobileMenuOpen={isMobileMenuOpen}
					onTabChange={setActiveTab}
				/>

				<main className={styles.mainContent}>
					<div className={styles.header}>
						<div className={styles.titleSection}>
							<div className={styles.titleContainer}>
								<h1 className={styles.pageTitle}>
									{activeTab === 'all' && 'All Notes'}
									{activeTab === 'favorites' && 'Favorite Notes'}
									{activeTab === 'settings' && 'Settings'}
								</h1>
								<div
									className={styles.burgerMenu}
									onClick={() => setIsMobileMenuOpen(prev => !prev)}
								>
									<span className={styles.burgerLine}></span>
									<span className={styles.burgerLine}></span>
									<span className={styles.burgerLine}></span>
								</div>
							</div>
							{activeTab !== 'settings' && (
								<div className={styles.notesCount}>{notes.length} notes</div>
							)}
						</div>

						{activeTab !== 'settings' && (
							<div className={styles.headerActions}>
								<button
									className={styles.createButton}
									onClick={() => {
										navigate(pageConfig.createNote)
									}}
								>
									<Plus className={styles.icon} />
									Create Note
								</button>
							</div>
						)}
					</div>

					{activeTab !== 'settings' && (
						<>
							<div className={styles.toolbar}>
								<div className={styles.searchSection}>
									<div className={styles.searchWrapper}>
										<Search className={styles.searchIcon} />
										<input
											type='text'
											placeholder='Search notes... Use #tag to search by tags'
											value={searchQuery}
											onChange={e => handleSearchInputChange(e.target.value)}
											className={styles.searchInput}
											onFocus={() =>
												setShowTagSuggestions(searchQuery.includes('#'))
											}
											onBlur={() =>
												setTimeout(() => setShowTagSuggestions(false), 200)
											}
										/>

										{showTagSuggestions && (
											<div className={styles.tagSuggestions}>
												<div className={styles.suggestionsHeader}>
													<Hash className={styles.suggestionsIcon} />
													Tags
												</div>
												{getTagSuggestions().map(tag => (
													<button
														key={tag}
														className={styles.tagSuggestion}
														onMouseDown={() => handleTagSuggestionClick(tag)}
													>
														#{tag}
													</button>
												))}
											</div>
										)}
									</div>

									{searchTags.length > 0 && (
										<div className={styles.activeTags}>
											{searchTags.map((tag, index) => (
												<div key={index} className={styles.activeTag}>
													<Hash className={styles.activeTagIcon} />
													{tag}
													<button
														className={styles.removeTag}
														onClick={() => removeSearchTag(tag)}
													>
														<X className={styles.removeTagIcon} />
													</button>
												</div>
											))}
										</div>
									)}
								</div>

								<div className={styles.filterSection}>
									<div className={styles.sortContainer}>
										<div className={styles.sortFilter}>
											<ArrowUpDown className={styles.filterIcon} />
											<select
												className={styles.sortSelect}
												value={sortBy}
												onChange={e => handleSortChange(e.target.value)}
											>
												{getSortSelectOptions().map(option => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</select>
										</div>

										<button
											className={`${styles.sortOrderButton} ${styles[sortOrder]}`}
											onClick={toggleSortOrder}
											title={`Sort: ${
												sortOrder === 'asc' ? 'ascending' : 'descending'
											}`}
										>
											{sortOrder === 'asc' ? (
												<ArrowUp className={styles.sortOrderIcon} />
											) : (
												<ArrowDown className={styles.sortOrderIcon} />
											)}
										</button>
									</div>
								</div>
							</div>

							<div className={styles.notesGrid}>
								{notes.map(note => (
									<NoteCard
										key={note.id}
										note={note}
										onView={() => navigate(pageConfig.noteLink(note.id))}
									/>
								))}
							</div>

							{notes.length === 0 && (
								<div className={styles.emptyState}>
									<div className={styles.emptyIcon}>📝</div>
									<h3>No notes found</h3>
									<p>Try changing your search query or create a new note</p>
									<button
										className={styles.createButton}
										onClick={() => {
											navigate(pageConfig.createNote)
										}}
									>
										<Plus className={styles.icon} />
										Create First Note
									</button>
								</div>
							)}
						</>
					)}

					{activeTab === 'settings' && <AccountSettings />}
				</main>
			</div>
		</>
	)
}

export default Dashboard
