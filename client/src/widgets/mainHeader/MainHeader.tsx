import React from 'react'
import styles from '@/widgets/mainHeader/MainHeader.module.css'
import logo from '@/assets/nazary-white.png'
import { Github, LogIn } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { pageConfig } from '@/pageConfig'

const MainHeader: React.FC = () => {
	const location = useLocation()
	const isHome = location.pathname === pageConfig.home

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<div className={styles.headerContent}>
					<div className={styles.logoSection}>
						<NavLink className={styles.brand} to={'/'}>
							<img
								src={logo}
								alt='Nazary Logo'
								className={styles.logoImage}
							/>
							<span className={styles.logoText}>Nazary</span>
						</NavLink>
					</div>

					<div className={styles.actions}>
						<a
							href={pageConfig.githubRepoLink}
							className={`${styles.button} ${styles.buttonGhost} ${styles.githubButton}`}
						>
							<Github className={styles.icon} />
						</a>
						{isHome ? (
							<NavLink
								className={`${styles.button} ${styles.buttonPrimary}`}
								to={pageConfig.login}
							>
								<LogIn
									className={`${styles.icon} ${styles.iconMr}`}
								/>
								Login
							</NavLink>
						) : (
							<NavLink
								to={pageConfig.home}
								className={`${styles.button} ${styles.buttonOutline}`}
							>
								Home
							</NavLink>
						)}
					</div>
				</div>
			</div>
		</header>
	)
}

export default MainHeader
