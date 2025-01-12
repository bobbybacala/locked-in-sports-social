import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '../../libs/axios'
import { Bell, Home, LogOut, User, Users } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'


const Navbar = () => {

    // in the navbar we are having notifications and connection, therefore we need the count bubble on the icon
    // first we get the authUser and then get authUsers notificaitons and connections
    const { data: authUser } = useQuery({ queryKey: ['authUser'] })
    const queryClient = useQueryClient()

    // now get notificaitons and connections
    const { data: notifications } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => axiosInstance.get('/notifications'),
        enabled: !!authUser // only run this if authUser is not null
    })

    const { data: connectionsRequests } = useQuery({
        queryKey: ['connectionsRequests'],
        queryFn: async () => axiosInstance.get('/connections/requests'),
        enabled: !!authUser // only run this if authUser is not null
    })

    // log to see if woroking
    // console.log('notifications', notifications);
    // console.log('connectionREqs', connectionsRequests);

    // mutation fucntion for when we have to logout
    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            const response = await axiosInstance.post('/auth/logout')
            // Clear all queries from the cache
            queryClient.clear()
            // Remove any auth tokens or user data from localStorage if you're using it
            localStorage.removeItem('token') // Add this if you're using token-based auth
            return response
        },
        onSuccess: () => {
            // Force navigate to login page
            window.location.href = '/login'
            // Alternative approach if the above doesn't work:
            // navigate('/login', { replace: true })
        }
    })

    // we need the unread notification count and connection request count
    const unreadNotificationCount = notifications?.data.filter(notifs => !notifs.read).length
    const connRequestCount = connectionsRequests?.data?.length

    return (
        <nav className='bg-black shadow-md sticky top-0 z-10'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex justify-between items-center py-3'>
                    <div className='flex items-center space-x-4'>
                        <Link to='/'>
                            <img className='h-7 rounded' src='/small-logo-2.png' alt='LinkedIn' />
                        </Link>
                    </div>
                    <div className='flex items-center gap-2 md:gap-6'>
                        {authUser ? (
                            <>
                                <NavLink to={"/"} className={({ isActive }) =>
                                    `flex flex-col items-center ${isActive ? "text-red-600" : "text-neutral-400"
                                    } hover:text-gray-500 ease-in  `
                                }>
                                    <Home size={20} />
                                    <span className='text-xs hidden md:block'>Home</span>
                                </NavLink>
                                <NavLink to='/network' className={({ isActive }) =>
                                    `flex flex-col items-center relative ${isActive ? "text-red-600" : "text-neutral-400"
                                    } hover:text-gray-500 ease-in  `
                                }>
                                    <Users size={20} />
                                    <span className='text-xs hidden md:block'>My Network</span>
                                    {connRequestCount > 0 && (
                                        <span
                                            className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
                                        >
                                            {connRequestCount}
                                        </span>
                                    )}
                                </NavLink>
                                <NavLink to='/notifications' className={({ isActive }) =>
                                    `flex flex-col items-center relative ${isActive ? "text-red-600" : "text-neutral-400"
                                    } hover:text-gray-500 ease-in  `
                                }>
                                    <Bell size={20} />
                                    <span className='text-xs hidden md:block'>Notifications</span>
                                    {unreadNotificationCount > 0 && (
                                        <span
                                            className='absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center'
                                        >
                                            {unreadNotificationCount}
                                        </span>
                                    )}
                                </NavLink>
                                <NavLink
                                    to={`/profile/${authUser.username}`}
                                    className={({ isActive }) =>
                                        `flex flex-col items-center relative ${isActive ? "text-red-600" : "text-neutral-400"
                                        } hover:text-gray-500 ease-in`
                                    }
                                >
                                    <User size={20} />
                                    <span className='text-xs hidden md:block'>{authUser.name}</span>
                                </NavLink>
                                <button
                                    className='flex items-center space-x-1 text-sm text-gray-400 hover:text-gray-800'
                                    onClick={() => logout()}
                                >
                                    <LogOut size={20} />
                                    <span className='hidden md:inline'>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to='/login' className='btn btn-ghost hover:bg-red-700'>
                                    Sign In
                                </Link>
                                <Link to='/signup' className='btn btn-ghost hover:bg-red-700'>
                                    Join now
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
