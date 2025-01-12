import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../libs/axios"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

const FriendRequest = ({ request }) => {
    // query invalidation to refresh the data
    const queryClient = useQueryClient()

    // mutate function to accept friend request
    const { mutate: acceptConnectionRequest } = useMutation({
        mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
        onSuccess: () => {
            // update the connections and connection requests
            queryClient.invalidateQueries({ queryKey: ['connections'] })
            queryClient.invalidateQueries({ queryKey: ['connectionsRequests'] })
            toast.success('Request accepted successfully')
        },
        onError: () => {
            toast.error('Error accepting friend request')
        }
    })

    // mutate function to reject friend request
    const { mutate: rejectConnectionRequest } = useMutation({
        mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['connectionRequests'] })
            toast.success('Request accepted successfully')
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Error accepting friend request')
        }
    })
    return (
        <div className='bg-neutral-800 rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md'>
            <div className='flex items-center gap-4'>
                {/* req sender info */}
                <Link to={`/profile/${request.sender.username}`}>
                    <img
                        src={request.sender.profilePicUrl || "/avatar.png"}
                        alt={request.name}
                        className='w-16 h-16 rounded-full object-cover'
                    />
                </Link>

                <div>
                    <Link to={`/profile/${request.sender.username}`} className='font-semibold text-lg text-white'>
                        {request.sender.name}
                    </Link>
                    <p className='text-neutral-500'>{request.sender.headline}</p>
                </div>
            </div>

            {/* buttons to accept and reject the request */}
            <div className='space-x-2'>
                <button
                    className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors'
                    onClick={() => acceptConnectionRequest(request._id)}
                >
                    Accept
                </button>
                <button
                    className='bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors'
                    onClick={() => rejectConnectionRequest(request._id)}
                >
                    Reject
                </button>
            </div>
        </div>
    )
}

export default FriendRequest
