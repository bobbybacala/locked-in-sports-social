import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { axiosInstance } from "../libs/axios"
import toast from "react-hot-toast"
import { Camera, Clock, MapPin, UserCheck, UserPlus, X } from "lucide-react"

const ProfileHeader = ({ userData, isOwnProfile, onSave }) => {

    // console.log('userdata', userData);

    // query client to update the profile page
    const queryClient = useQueryClient()

    // we need some states to keep trackt
    // if we are editing the profile or not, the edited data which is initially an emty object
    const [isEditing, setIsEditing] = useState(false)
    const [editedData, setEditedData] = useState({})

    // get the authUser
    // const { data: authUser } = useQuery({ queryKey: ['authUser'] })

    // when we are on someones profile we want to see that are we connected to them or not
    const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery({
        queryKey: ['connectionStatus', userData._id],
        queryFn: () => axiosInstance.get(`connections/status/${userData._id}`),
        enabled: !isOwnProfile // only fetch the conneciton status if we are on someone elses profile page
    })

    // console.log('connectionStatus', connectionStatus);

    // check if we are in the connections array of the user whose page we are on
    // const isConnected = userData.connections.some((connection) => connection === authUser._id)
    // console.log(isConnected);

    // if we are not connected send a request
    const { mutate: sendConnectionRequest } = useMutation({
        mutationFn: (userId) => axiosInstance.post(`connections/request/${userId}`),
        onSuccess: () => {
            toast.success('Connection request sent successfully')
            refetchConnectionStatus()
            queryClient.invalidateQueries(['connectionRequests'])
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Error sending connection request')
        }
    })

    // accept and reject connection request functions
    const { mutate: acceptRequest } = useMutation({
        mutationFn: (userId) => axiosInstance.put(`connections/accept/${userId}`),
        onSuccess: () => {
            toast.success('Connection request accepted successfully')
            refetchConnectionStatus()
            queryClient.invalidateQueries(['connectionRequests'])
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Error accepting connection request')
        }

    })

    const { mutate: rejectRequest } = useMutation({
        mutationFn: (userId) => axiosInstance.put(`connections/reject/${userId}`),
        onSuccess: () => {
            toast.success('Connection request rejected')
            refetchConnectionStatus()
            queryClient.invalidateQueries(['connectionRequests'])
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Error rejecting connection request')
        }

    })

    // mutation to remove a connection
    const { mutate: removeConnection } = useMutation({
        mutationFn: (userId) => axiosInstance.delete(`connections/${userId}`),
        onSuccess: () => {
            toast.success('Connection removed successfully')
            refetchConnectionStatus()
            queryClient.invalidateQueries(['connections', 'connectionsRequests'])
        },
        onError: (error) => {
            toast.error(error.response?.data?.error || 'Error removing connection')
        }
    })

    // returns the connection status
    const getConnectionStatus = () => {
        return connectionStatus?.data?.status
    }

    // console.log('status', getConnectionStatus());

    // function to render connection button
    const renderConnectionButton = () => {
        // base class of all buttons
        const baseClass = "text-white py-2 px-4 rounded-full transition duration-200 flex items-center justify-center";

        // get the connection status
        switch (getConnectionStatus()) {

            case "connected":
                return (
                    <div className='flex gap-2 justify-center'>
                        <div className={`${baseClass} bg-green-600 hover:bg-green-800`}>
                            <UserCheck size={20} className='mr-2' />
                            Connected
                        </div>
                        <button
                            className={`${baseClass} bg-red-600 hover:bg-red-900 text-sm`}
                            onClick={() => removeConnection(userData._id)}
                        >
                            <X size={20} className='mr-2' />
                            Remove Connection
                        </button>
                    </div>
                );

            case "pending":
                return (
                    <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
                        <Clock size={20} className='mr-2' />
                        Pending
                    </button>
                );

            case "received":
                return (
                    <div className='flex gap-2 justify-center'>
                        <button
                            onClick={() => acceptRequest(connectionStatus.data.requestId)}
                            className={`${baseClass} bg-green-600 hover:bg-green-800`}
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => rejectRequest(connectionStatus.data.requestId)}
                            className={`${baseClass} bg-red-600 hover:bg-red-800`}
                        >
                            Reject
                        </button>
                    </div>
                );
            default:
                return (
                    <button
                        onClick={() => sendConnectionRequest(userData._id)}
                        className='bg-neutral-800 hover:bg-neutral-900 text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center'
                    >
                        <UserPlus size={20} className='mr-2' />
                        Connect
                    </button>
                );
        }
    }

    const handleImageChange = (e) => {
        // take the image from the input
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedData((prev) => ({ ...prev, [e.target.name]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    }

    // function to handle save profile after editing
    const handleSave = () => {
        onSave(editedData)
        setIsEditing(false)
    }


    return (
        <div className="bg-black rounded-lg shadow p-4 mb-6">
            {/* coverPic */}
            <div
                className='relative h-48 rounded-t-lg bg-cover bg-center'
                style={{
                    backgroundImage: `url('${editedData.coverPic || userData.coverPic || "/banner.png"}')`,
                }}
            >
                {isEditing && (
                    <label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
                        <Camera className="text-neutral-800" size={20} />
                        <input
                            type='file'
                            className='hidden'
                            name='coverPic'
                            onChange={handleImageChange}
                            accept='image/*'
                        />
                    </label>
                )}
            </div>


            <div className="p-4">
                {/* profile pic */}
                <div className='relative -mt-20 mb-4'>
                    <img
                        className='w-32 h-32 rounded-full mx-auto object-cover'
                        src={editedData.profilePicUrl || userData.profilePicUrl || "/avatar.png"}
                        alt={userData.name}
                    />

                    {isEditing && (
                        <label className='absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer'>
                            <Camera size={20} className='text-neutral-800' />
                            <input
                                type='file'
                                className='hidden'
                                name='profilePicUrl'
                                onChange={handleImageChange}
                                accept='image/*'
                            />
                        </label>
                    )}
                </div>

                {/* name and headline part */}
                <div className="text-center mb-4">
                    {isEditing ? (
                        <div className="mb-2">

                            <input
                                type="text"
                                value={editedData.name ?? userData.name}
                                onChange={(e) => setEditedData({...editedData,  name: e.target.value })}
                                className="text-white text-2xl font-bold mb-2 text-center bg-neutral-800 rounded-2xl p-2"
                            />
                            <br />
                        </div>
                    ) : (
                        <h1 className='text-2xl font-bold mb-2'>{userData.name}</h1>
                    )}

                    {isEditing ? (
                        <input
                            type="text"
                            value={editedData.headline ?? userData.headline}
                            onChange={(e) => setEditedData({...editedData,  headline: e.target.value })}
                            className="text-white text-2xl font-semibold mb-2 text-center bg-neutral-800 rounded-2xl p-2"
                        />
                    ) : (
                        <p className='text-neutral-500 text-xl font-semibold mb-2'>{userData.headline}</p>
                    )}

                    <div className='flex justify-center items-center mt-2'>
                        <MapPin size={16} className='text-gray-500 mr-1' />
                        {isEditing ? (
                            <input
                                type='text'
                                value={editedData.location ?? userData.location}
                                onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                                className='text-white text-center bg-neutral-800 rounded-2xl p-2'
                            />
                        ) : (
                            <span className='text-gray-600'>{userData.location}</span>
                        )}
                    </div>
                </div>

                {/* now we can make a check if its our own profile we can edit it */}
                {isOwnProfile ? (
                    // now check are we editiing the profile are not
                    isEditing ? (
                        <button
                            className='w-full bg-neutral-800 text-white py-2 px-4 rounded-full hover:bg-neutrak-900
							 transition duration-200'
                            onClick={handleSave}
                        >
                            Save Profile
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className='w-full bg-neutral-800 text-white py-2 px-4 rounded-full hover:bg-neutral-900
							 transition duration-200'
                        >
                            Edit Profile
                        </button>
                    )
                ) : (
                    <div className="flex justify-center">{renderConnectionButton()}</div>
                )}
            </div>
        </div>
    )
}

export default ProfileHeader
