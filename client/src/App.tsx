import MainLayout from '@/layouts/MainLayout/MainLayout.tsx'
import Auth from '@/pages/auth/Auth.tsx'
import ConfirmEmail from '@/pages/confirmEmail/ConfirmEmail.tsx'
import Home from '@/pages/home/Home.tsx'
import Loading from '@/pages/loading/Loading.tsx'
import NotFound from '@/pages/notFound/NotFound.tsx'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import ResendVerify from './pages/resendVerify/ResendVerify'

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route element={<MainLayout />}>
						<Route path={'/'} element={<Home />} />
						<Route path={'/auth'} element={<Auth />}>
							<Route path='login' element={<Auth />} />
							<Route path='register' element={<Auth />} />
						</Route>
						<Route
							path='/verify-email'
							element={<ConfirmEmail />}
						/>
						<Route
							path='/resend-verification'
							element={<ResendVerify />}
						/>
					</Route>
					<Route path={'/loading'} element={<Loading />} />
					<Route element={<MainLayout />}>
						<Route path='*' element={<NotFound />} />
					</Route>
				</Routes>
			</Router>
		</>
	)
}

export default App
