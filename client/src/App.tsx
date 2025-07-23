import MainLayout from '@/layouts/MainLayout/MainLayout.tsx'
import { pageConfig } from '@/pageConfig'
import Auth from '@/pages/auth/Auth.tsx'
import ConfirmEmail from '@/pages/confirmEmail/ConfirmEmail.tsx'
import Home from '@/pages/home/Home.tsx'
import NotFound from '@/pages/notFound/NotFound.tsx'
import ResendVerify from '@/pages/resendVerify/ResendVerify'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route element={<MainLayout />}>
						<Route path={pageConfig.home} element={<Home />} />
						<Route path={pageConfig.auth} element={<Auth />}>
							<Route path={pageConfig.login} element={<Auth />} />
							<Route
								path={pageConfig.register}
								element={<Auth />}
							/>
						</Route>
						<Route
							path={pageConfig.verifyEmail}
							element={<ConfirmEmail />}
						/>
						<Route
							path={pageConfig.resendVerification}
							element={<ResendVerify />}
						/>
					</Route>
					<Route element={<MainLayout />}>
						<Route
							path={pageConfig.notFound}
							element={<NotFound />}
						/>
					</Route>
				</Routes>
			</Router>
		</>
	)
}

export default App
