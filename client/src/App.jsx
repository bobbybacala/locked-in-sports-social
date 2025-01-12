
import './App.css'
import Layout from './components/layout/layout.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/auth/SignUpPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './libs/axios.js'
import NotificationsPage from './pages/NotificationsPage.jsx'
import NetworkPage from './pages/NetworkPage.jsx'
import PostPage from './pages/PostPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

function App() {

	const { data: authUser, isLoading } = useQuery({
		// we cn use this query in other components without again retriveing
		queryKey: ['authUser'],
		queryFn: async () => {
			// const token = localStorage.getItem('token');
			// if (!token) {
			// 	toast.error('You are not logged in.');
			// 	return null;
			// }
			try {
				// axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
				// get the data for the current user
				const response = await axiosInstance.get('/auth/me')
				return response.data
			} catch (error) {
				if (error.response && error.response.status === 401) {
					// toast.error('Unauthorised: No Token Provided');
					return null
				} else {
					toast.error('An unexpected error occurred')
				}
				// localStorage.removeItem('token'); // Clear invalid token
				toast.error('You are not logged in', error.response.data.Message)
			}
		}
	})

	// if loading, return null so that we never see the login and signup page when we are authenticated
	if (isLoading) {
		return null
	}

	// log the user once to see if working
	// console.log(`user: ${authUser}`, authUser);

	// todo:
	// sign up page extended
	// coaches page with model in the database
	// club / academy page with model in the database

	return (
		<Layout>

			<Routes>
				{/* here protect the home page so that only authenticated users can see the home page */}
				{/* navigate unauthenticated users to the home page */}
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to={'/signup'} />} />

				{/* if we are authenticated, then navigate them to home page, because this is a protected route, else navigate them to the login /signup page Notifications page and profile page*/}
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />

				{/* for network and notifiaciton pg */}
				<Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to={'/signup'} />} />
				<Route path='/network' element={authUser ? <NetworkPage /> : <Navigate to={'/signup'} />} />

				{/* for post page */}
				<Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to={'/signup'} />} />

				{/* for profile page */}
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to={'/signup'} />} />

			</Routes>
			<Toaster />
		</Layout>
	)
}

export default App
