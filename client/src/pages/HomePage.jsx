import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "../libs/axios"
import Sidebar from "../components/Sidebar"
import PostCreation from "../components/PostCreation"
import Post from "../components/Post"
import { Loader, Users, UserX } from "lucide-react"
import RecommendedUser from "../components/RecommendedUser"
import { useNavigate } from "react-router-dom"

const HomePage = () => {
    // because when clicked on a post we navigate to the post page
    const navigate = useNavigate()

    // we need the authenticated user to display data on the left sidebar
    const { data: authUser, isLoading: isAuthLoading } = useQuery({
        queryKey: ['authUser']
    })

    // on the home page, we would like the fetch the posts data and the recommeded users data
    const { data: recommendedUsers, isLoading: isRecommendedUsersLoading } = useQuery({
        queryKey: ['recommendedUsers'],
        queryFn: async () => {
            const response = await axiosInstance.get('/users/suggestions')
            return response.data
        },

        // dont fetch until we have authUser
        enabled: !!authUser
    })

    // called everytime it is invalidated
    const { data: posts, isLoading: isPostsLoading, error: postsError } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await axiosInstance.get('/posts')
            return response.data
        },

        // dont fetch until we have authUser
        enabled: !!authUser
    })

    // show loading spinner if authUser is loading
    if (isAuthLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader className="animate-spin" size={32} />
            </div>
        )
    }

    console.log('recommendedUsers', recommendedUsers);
    console.log('posts', posts);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="hidden lg:block lg:col-span-1">
                <Sidebar user={authUser} />
            </div>

            <div className="col-span-1 lg:col-span-2 order-first lg:order-none ">
                <PostCreation user={authUser} />

                {isPostsLoading ? (
                    <div className="flex justify-center p-4">
                        <Loader className="animate-spin" size={24} />
                    </div>
                ) : postsError ? (
                    <div className="bg-black rounded-lg shadow p-4 text-center text-red-500">
                        Error loading posts. Please try again later.
                    </div>
                ) : posts?.length > 0 ? (
                    posts.map(post => (
                        <div
                            key={post._id}
                            className="cursor-pointer"
                            onClick={() => {
                                // Prevent navigation if text is selected
                                if (window.getSelection().toString()) {
                                    // window.getSelection() returns the selected text, this is a browser API
                                    return; // Prevent navigation
                                }
                                // Proceed with navigation if no text is selected
                                navigate(`/post/${post._id}`)
                            }}
                        >
                            <Post post={post} defaultCommentsShow={false} />
                        </div>
                    ))
                ) : (
                    <div className='bg-black rounded-lg shadow p-8 text-center'>
                        <div className='mb-6'>
                            <Users size={64} className='mx-auto text-red-600' />
                        </div>
                        <h2 className='text-2xl font-bold mb-4 text-white'>No Posts Yet</h2>
                        <p className='text-white mb-6'>Connect with athletes to start seeing posts in your feed!</p>
                    </div>
                )}

            </div>

            {/* the component for the recommeded users */}
            {!isRecommendedUsersLoading && recommendedUsers?.length > 0 ? (
                <div className='col-span-1 lg:col-span-1 hidden lg:block min-w-[23vw]'>
                    <div className='bg-black rounded-lg shadow p-4'>
                        <h2 className='font-semibold mb-4'>Athletes you may know</h2>
                        {recommendedUsers?.map((user) => (
                            <RecommendedUser key={user._id} user={user} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className='bg-black rounded-lg shadow p-6 text-center mb-6 max-h-fit min-w-[23vw]'>
                    <UserX size={48} className='mx-auto text-white mb-4' />
                    <h3 className='text-2xl font-semibold mb-2'>No Recommended Users</h3>
                    <p className='text-neutral-500'>
                        You don&apos;t have any recommeded users at the moment.
                    </p>
                </div>
            )}
        </div>
    )
}

export default HomePage
