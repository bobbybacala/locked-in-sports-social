import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../libs/axios"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react"

// for a single recommended user
const RecommendedUser = ({ user }) => {
    // query client to invalidate the connection Status
    const queryClient = useQueryClient()

    // get connection request with any user._id
    const { data: connectionStatus, isLoading } = useQuery({
        queryKey: ['connectionStatus', user._id],
        // get the connection status with the user
        queryFn: () => axiosInstance.get(`/connections/status/${user._id}`)
    })

    console.log('connectionStatus', connectionStatus);

    // mutation function to send a request
    const { mutate: sendConnectionRequest } = useMutation({
        mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
        onSuccess: () => {
            toast.success('Connection request sent successfully')
            queryClient.invalidateQueries({ queryKey: ['connectionStatus', user._id] })
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Connection request failed')
        }
    })

    // mutation function to accept and reject requests
    const { mutate: acceptConnectionRequest } = useMutation({
        mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['connectionStatus', user._id] })
            toast.success('Request accepted successfully')
        },
        onError: (error) => {
            console.log('error in accepting req', error);
            toast.error(error.response?.data?.error || 'Connection request failed')
        }
    })

    const { mutate: rejectConnectionRequest } = useMutation({
        mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['connectionStatus', user._id] })
            toast.success('Connection request rejected successfully')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Connection request failed')
        }
    })

    // we have to render many buttons based on the connection status
    // if we are not connected, we can send a request, if we have received a request, we can accept or reject the request, if we are connected, we can display a message that we are connected
    const renderButton = () => {
        // if connection status is loading show a loader
        if (isLoading) {
            return (
                <button className='px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500' disabled>
                    Loading...
                </button>
            );
        }
        // there are 4 cases:
        // 1. we are not connected, we can send a request
        // 2. we have received a request, we can accept or reject the request
        // 3. we are connected, we can display a message that we are connected
        // 4. we have sent a request, we can display a message that we have sent a request

        switch (connectionStatus?.data?.status) {
            case "pending":
                return (
                    <button
                        className='px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center'
                        disabled
                    >
                        <Clock size={16} className='mr-1' />
                        Pending
                    </button>
                );

            case "received":
                return (
                    <div className='flex gap-2 justify-center'>
                        <button
                            onClick={() => acceptConnectionRequest(connectionStatus.data.requestId)}
                            className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
                        >
                            <Check size={16} />
                        </button>
                        <button
                            onClick={() => rejectConnectionRequest(connectionStatus.data.requestId)}
                            className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
                        >
                            <X size={16} />
                        </button>
                    </div>
                );

            case "connected":
                return (
                    <button
                        className='px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center'
                        disabled
                    >
                        <UserCheck size={16} className='mr-1' />
                        Connected
                    </button>
                );

            default:
                return (
                    <button
                        className='px-3 py-1 rounded-full text-sm border-2 border-primary text-white hover:bg-primary  transition-colors duration-200 flex items-center'
                        onClick={handleConnect}
                    >
                        <UserPlus size={16} className='mr-1' />
                        Connect
                    </button>
                );
        }
    }

    // if we are not connected, we can send a request
    const handleConnect = () => {
        if (connectionStatus?.data?.status === "not connected") {
            sendConnectionRequest(user._id)
        }
    }



    return (
        <div className='flex items-center justify-between mb-4 bg-neutral-900 rounded-md p-2'>
            <Link to={`/profile/${user.username}`} className='flex items-center flex-grow'>
                <img
                    src={user.profilePicUrl || "/avatar.png"}
                    alt={user.name}
                    className='w-12 h-12 rounded-full mr-3'
                />
                <div>
                    <h3 className='font-semibold text-sm'>{user.name}</h3>
                    <p className='text-xs text-info'>{user.headline}</p>
                </div>
            </Link>
            {renderButton()}
        </div>
    )
}

export default RecommendedUser
