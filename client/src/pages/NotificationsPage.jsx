import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../libs/axios"
import toast from "react-hot-toast"
import { BellOff, ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from "lucide-react"
import { Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { formatDistanceToNow } from "date-fns"

const NotificationsPage = () => {
    const queryClient = useQueryClient()

    // get the authUser
    const { data: authUser } = useQuery({ queryKey: ['authUser'] })

    // get the notifications
    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => axiosInstance.get('/notifications'),
        enabled: !!authUser
    })

    console.log('notifications', notifications);
    // mutate to mark notification as read and detete it
    const { mutate: markAsReadMutation } = useMutation({
        mutationFn: async (notificationId) => axiosInstance.put(`notifications/${notificationId}/read`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            toast.success('Notification marked as read')
        },
        onError: () => {
            toast.error('Error marking notification as read')
        }
    })

    // mutate to delete the notification
    const { mutate: deleteMutation } = useMutation({
        mutationFn: async (notificationId) => axiosInstance.delete(`notifications/${notificationId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
            toast.success('Notification successfully deleted')
        },
        onError: () => {
            toast.error('Error deleting notification as read')
        }
    })

    // to render the icon of the notification
    const renderNotificationIcon = (type) => {
        switch (type) {
            case 'like':
                return <ThumbsUp className="text-red-600" />
            case "comment":
                return <MessageSquare className='text-green-600' />;
            case "connectionAccepted":
                return <UserPlus className='text-purple-600' />;
            default:
                return null;
        }
    }

    // function to render the content of the notification
    const renderNotificationContent = (notification) => {
        switch (notification.type) {
            case "like":
                return (
                    <span>
                        <strong>{notification.relatedUser.name}</strong> liked your post
                    </span>
                );
            case "comment":
                return (
                    <span>
                        <Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
                            {notification.relatedUser.name}
                        </Link>{" "}
                        commented on your post
                    </span>
                );
            case "connectionAccepted":
                return (
                    <span>
                        <Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
                            {notification.relatedUser.name}
                        </Link>{" "}
                        accepted your connection request
                    </span>
                );
            default:
                return null;
        }
    }

    // function to render the related post on which the notification is created
    const renderRelatedPost = (relatedPost) => {
        if (!relatedPost) return null;

        return (
            <Link
                to={`/post/${relatedPost._id}`}
                className='mt-2 p-2 bg-neutral-800 rounded-md flex items-center space-x-2 hover:bg-neutral-900 transition-colors'
            >
                {relatedPost.image && (
                    <img src={relatedPost.image} alt='Post preview' className='w-10 h-10 object-cover rounded' />
                )}
                <div className='flex-1 overflow-hidden'>
                    <p className='text-sm text-white truncate'>{relatedPost.content}</p>
                </div>
                <ExternalLink size={14} className='text-gray-400' />
            </Link>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="col-span-1 lg:col-span-1">
                <Sidebar user={authUser} />
            </div>

            {/* Render the notifications */}
            <div className="bg-black rounded-lg shadow p-6 mb-6 col-span-1 lg:col-span-3">
                <h1 className="text-2xl font-bold mb-4">Notifications</h1>

                {isLoading ? (
                    <p>Loading Notifications...</p>
                ) : (
                    notifications && notifications.data.length > 0 ? (
                        <ul>
                            {/* List of notifications */}
                            {notifications.data.map((notification) => (
                                <li
                                    key={notification._id}
                                    className={`bg-neutral-900 border rounded-lg p-4 my-4 transition-all hover:shadow-lg ${!notification.read ? "border-neutral-800" : "border-green-900"}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            {/* link to the user profile */}
                                            <Link to={`/profile/${notification.relatedUser.username}`}>
                                                <img
                                                    src={notification.relatedUser.profilePicture || "/avatar.png"}
                                                    alt={notification.relatedUser.name}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />
                                            </Link>

                                            {/* notification content */}
                                            <div>
                                                <div className='flex items-center gap-2'>
                                                    <div className='p-1 bg-gray-100 rounded-full'>
                                                        {renderNotificationIcon(notification.type)}
                                                    </div>
                                                    <p className='text-sm'>{renderNotificationContent(notification)}</p>
                                                </div>
                                                <p className='text-xs text-gray-500 mt-1'>
                                                    {formatDistanceToNow(new Date(notification.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </p>
                                                {renderRelatedPost(notification.relatedPost)}
                                            </div>
                                        </div>

                                        {/* buttons to mark the notification as read or delete */}
                                        <div className="flex gap-2">
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsReadMutation(notification._id)}
                                                    className='p-1 bg-neutral-800 text-grey-600 rounded hover:bg-green-900 transition-colors'
                                                    aria-label='Mark as read'
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            )}

                                            <button
                                                onClick={() => deleteMutation(notification._id)}
                                                className='p-1 bg-neutral-800 text-grey-600 rounded hover:bg-red-900 transition-colors'
                                                aria-label='Mark as read'
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="bg-neutral-900 rounded-lg shadow p-6 text-center mb-6">
                            <BellOff size={48} className="mx-auto text-white mb-4" />
                            <h3 className="text-2xl font-semibold mb-2">No Notifications</h3>
                            <p className="text-neutral-500">
                                You currently don&apos;t have any notifications.
                            </p>
                            <p className="text-neutral-500 mt-2">
                                Stay tuned! Updates and messages will appear here as they come in.
                            </p>
                        </div>

                    )
                )}
            </div>
        </div>

    )
}

export default NotificationsPage
