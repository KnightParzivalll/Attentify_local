import { GlobalLayout } from 'components/layouts/GlobalLayout'
import LoadingOrError from 'components/LoadingOrError'
import Dashboard from 'pages/Dashboard'
import LoginPage from 'pages/LoginPage'
import TeacherSchedule from 'pages/TeacherSchedule'
import type { ReactElement } from 'react'
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { FiCalendar, FiHome, FiUsers } from 'react-icons/fi'
import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
	useLocation
} from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Create a protected route component
const ProtectedRoute = ({ children }: { children: ReactElement }) => {
	const {
		state: { user, isLoading, error }
	} = useAuth()
	const location = useLocation()

	if (isLoading) {
		return <LoadingOrError />
	}

	if (error || !user) {
		return <Navigate to='/login' state={{ from: location }} replace />
		// alert('navigate to login')
	}

	return children
}

// Add reverse protection for login page
const PublicRoute = ({ children }: { children: ReactElement }) => {
	const {
		state: { user }
	} = useAuth()
	const location = useLocation()

	if (user) {
		const from = location.state?.from?.pathname || '/'
		return <Navigate to={from} replace />
	}

	return children
}

const LayoutRoute = ({ children }: { children: ReactElement }) => {
	const { t } = useTranslation()

	const navItems = [
		{ name: t('layout.schedule'), icon: FiHome, path: '/' },
		{ name: t('layout.attendance'), icon: FiUsers, path: '/attendance' },
		{ name: t('layout.students'), icon: FiCalendar, path: '/students' }
	]

	return <GlobalLayout navItems={navItems}>{children}</GlobalLayout>
}

export default function App(): ReactElement {
	return (
		<BrowserRouter>
			<Suspense fallback={<LoadingOrError />}>
				<Routes>
					{/* Public routes */}
					<Route
						path='/login'
						element={
							<PublicRoute>
								<LoginPage />
							</PublicRoute>
						}
					/>

					{/* Protected routes */}
					<Route
						path='/'
						element={
							<ProtectedRoute>
								<LayoutRoute>
									<TeacherSchedule />
								</LayoutRoute>
							</ProtectedRoute>
						}
					/>

					<Route
						path='/attendance'
						element={
							<ProtectedRoute>
								<LayoutRoute>
									<Dashboard />
								</LayoutRoute>
							</ProtectedRoute>
						}
					/>

					{/* Fallback route */}
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
