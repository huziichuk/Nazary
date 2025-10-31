import logo from '@/assets/nazary-white.png'
import { pageConfig } from '@/pageConfig'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

const Auth = () => {
	const navigate = useNavigate()
	const location = useLocation()

	const isLogin = location.pathname === pageConfig.login

	

	const handleTabClick = (mode: 'login' | 'register') => {
		if (mode === 'login') {
			navigate(pageConfig.login)
		} else {
			navigate(pageConfig.register)
		}
	}

	return (
		<div className={styles.authPage}>
			<div className={styles.container}>
				<div className={styles.authCard}>
					<div className={styles.header}>
						<div className={styles.logoSection}>
							<img
								src={logo}
								alt='Nazary Logo'
								className={styles.logo}
							/>
							<h1 className={styles.title}>Nazary</h1>
						</div>
						<p className={styles.subtitle}>
							{isLogin
								? 'Log in to your account'
								: 'Create a new account'}
						</p>
					</div>

					<div className={styles.tabSection}>
						<div className={styles.tabs}>
							<button
								className={`${styles.tab} ${
									isLogin ? styles.tabActive : ''
								}`}
								onClick={() => handleTabClick('login')}
							>
								Log In
							</button>
							<button
								className={`${styles.tab} ${
									!isLogin ? styles.tabActive : ''
								}`}
								onClick={() => handleTabClick('register')}
							>
								Register
							</button>
						</div>
					</div>

					<div className={styles.formSection}>
						{isLogin ? <LoginForm /> : <RegisterForm />}
					</div>

					<div className={styles.footer}>
						<p className={styles.footerText}>
							{isLogin
								? "Don't have an account?"
								: 'Already have an account?'}
							<button
								type='button'
								className={styles.switchButton}
								onClick={() =>
									navigate(
										isLogin
											? pageConfig.register
											: pageConfig.login
									)
								}
							>
								{isLogin ? 'Register' : 'Log In'}
							</button>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Auth
