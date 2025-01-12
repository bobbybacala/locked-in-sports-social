import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../libs/axios"
import Sidebar from "../components/Sidebar"
import { UserPlus } from "lucide-react"
import FriendRequest from "../components/FriendRequest"
import UserCard from "../components/UserCard"

const NetworkPage = () => {

    // get the authenticated user
    const { data: authUser } = useQuery({ queryKey: ['authUser'] })

    // get the connection requests and connections for this authUser
    const { data: connections } = useQuery({
        queryKey: ['connections'],
        queryFn: () => axiosInstance.get(`/connections`)
    })

    const { data: connectionsRequests } = useQuery({
        queryKey: ['connectionsRequests'],
        queryFn: () => axiosInstance.get(`/connections/requests`)
    })

    console.log('connections',connections);
    console.log('requests',connectionsRequests);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="col-span-1 lg:col-span-1">
                <Sidebar user={authUser} />
            </div>

            {/* display the conn related users */}
            <div className="col-span-1 lg:col-span-3">
                <div className='bg-black rounded-lg shadow p-6 mb-6'>
                    <h1 className="text-2xl font-bold mb-6">My Network</h1>

                    {/* display the connection requests */}
                    {connectionsRequests?.data.length > 0 ? (
                        <div className="mb-8">
                            <h1 className="text-xl font-semibold mb-6">Connection Requests</h1>
                            <div className="space-y-4">
                                {connectionsRequests.data.map((request) => (
                                    <FriendRequest key={request.id} request={request} />
                                ))}
                            </div>
                        </div>

                    ) : (
                        <div className='bg-neutral-900 rounded-lg shadow p-6 text-center mb-6'>
                            <UserPlus size={48} className='mx-auto text-white mb-4' />
                            <h3 className='text-2xl font-semibold mb-2'>No Connection Requests</h3>
                            <p className='text-neutral-500'>
                                You don&apos;t have any pending connection requests at the moment.
                            </p>
                            <p className='text-neutral-500 mt-2'>
                                Explore suggested connections below to expand your network!
                            </p>
                        </div>
                    )}

                    {/* dispay the connections */}
                    {connections?.data.length > 0 && (
                        <div className="mb-8">
                            <h1 className="text-xl font-semibold mb-6">My Connections</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {connections.data.map((connection) => (
                                    <UserCard key={connection._id} user={connection} isConnection={true} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NetworkPage
