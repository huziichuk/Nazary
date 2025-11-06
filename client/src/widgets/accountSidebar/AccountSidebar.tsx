import logo from '@/assets/nazary-white.png'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/hooks/useLogout'
import { pageConfig } from '@/pageConfig'
import { FileText, Heart, Home, LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import styles from './AccountSidebar.module.css'

interface AccountSidebarProps {
	activeTab: 'all' | 'favorites' | 'settings'
	onTabChange: (tab: 'all' | 'favorites' | 'settings') => void
	isMobileMenuOpen?: boolean
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({
	activeTab,
	onTabChange,
	isMobileMenuOpen = false,
}) => {
	const navigate = useNavigate()

	const logout = useLogout()

	const { user } = useAuth()

	const menuItems = [
		{
			id: 'all' as const,
			label: 'All',
			icon: FileText,
			count: null,
		},
		{
			id: 'favorites' as const,
			label: 'Favorites',
			icon: Heart,
			count: null,
		},
		{
			id: 'settings' as const,
			label: 'Settings',
			icon: Settings,
			count: null,
		},
	]

	return (
		<aside
			className={`${styles.sidebar} ${isMobileMenuOpen ? styles.active : ''}`}
		>
			<div className={styles.header}>
				<div className={styles.logoSection}>
					<img src={logo} alt='Nazary Logo' className={styles.logo} />
					<span className={styles.logoText}>Nazary</span>
				</div>
			</div>

			<nav className={styles.navigation}>
				<div className={styles.section}>
					<div className={styles.sectionTitle}>Navigation</div>
					<ul className={styles.menuList}>
						{menuItems.map(item => {
							const Icon = item.icon
							return (
								<li key={item.id}>
									<button
										className={`${styles.menuItem} ${
											activeTab === item.id ? styles.active : ''
										}`}
										onClick={() => onTabChange(item.id)}
									>
										<Icon className={styles.menuIcon} />
										<span className={styles.menuLabel}>{item.label}</span>
										{item.count && (
											<span className={styles.menuCount}>{item.count}</span>
										)}
									</button>
								</li>
							)
						})}
					</ul>
				</div>

				<div className={styles.section}>
					<div className={styles.sectionTitle}>Actions</div>
					<ul className={styles.menuList}>
						<li>
							<button
								className={styles.menuItem}
								onClick={() => navigate(pageConfig.home)}
							>
								<Home className={styles.menuIcon} />
								<span className={styles.menuLabel}>Home</span>
							</button>
						</li>
						<li>
							<button className={`${styles.menuItem} ${styles.logoutItem}`}>
								<LogOut className={styles.menuIcon} />
								<span onClick={logout} className={styles.menuLabel}>
									Logout
								</span>
							</button>
						</li>
					</ul>
				</div>
			</nav>

			<div className={styles.footer}>
				<div className={styles.userInfo}>
					<div className={styles.avatar}>
						<span>{user?.name[0] || user?.email[0]}</span>
					</div>
					<div className={styles.userDetails}>
						<div className={styles.userName}>{user?.name}</div>
						<div className={styles.userEmail}>{user?.email}</div>
					</div>
				</div>
			</div>
		</aside>
	)
}

export default AccountSidebar
