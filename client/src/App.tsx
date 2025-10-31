import MainLayout from '@/layouts/MainLayout/MainLayout.tsx'
import { pageConfig } from '@/pageConfig'
import Auth from '@/pages/auth/Auth.tsx'
import ConfirmEmail from '@/pages/confirmEmail/ConfirmEmail.tsx'
import Home from '@/pages/home/Home.tsx'
import NotFound from '@/pages/notFound/NotFound.tsx'
import ResendVerify from '@/pages/resendVerify/ResendVerify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import NoteCreator from './pages/createNote/CreateNote'
import Dashboard from './pages/dashboard/Dashboard'
import ResetPassword from './pages/resetPassword/ResetPassword'
import MasterKeyProvider from './providers/MasterKeyProvider'
import NoteViewer from './pages/noteViewer/NoteViewer'

const client = new QueryClient()

function App() {
	return (
		<>
			<QueryClientProvider client={client}>
				<ReactQueryDevtools initialIsOpen={false} />
				<MasterKeyProvider>
					<Router>
						<Routes>
							<Route element={<MainLayout />}>
								<Route path={pageConfig.home} element={<Home />} />
								<Route path={pageConfig.auth} element={<Auth />}>
									<Route path={pageConfig.login} element={<Auth />} />
									<Route path={pageConfig.register} element={<Auth />} />
								</Route>
								<Route
									path={pageConfig.verifyEmail}
									element={<ConfirmEmail />}
								/>
								<Route
									path={pageConfig.resendVerification}
									element={<ResendVerify />}
								/>
								<Route
									path={pageConfig.resetPassword}
									element={<ResetPassword />}
								/>
							</Route>
							<Route element={<ProtectedRoute />}>
								<Route element={<MainLayout />}>
									<Route element={<Dashboard />} path={pageConfig.dashboard} />
									<Route
										element={<NoteCreator />}
										path={pageConfig.createNote}
									/>
								</Route>
							</Route>
							<Route element={<MainLayout />}>
								<Route path={pageConfig.notFound} element={<NotFound />} />
							</Route>
							<Route path={pageConfig.noteRoute} element={<NoteViewer />} />
						</Routes>
					</Router>
				</MasterKeyProvider>
			</QueryClientProvider>
		</>
	)
}

export default App
