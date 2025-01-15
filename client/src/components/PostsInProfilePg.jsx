import { useQuery } from "@tanstack/react-query"
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../libs/axios";

const PostsInProfilePg = ({ userData }) => {

    // when clicked on the post navigate to the post page
    const navigate = useNavigate()

    // get the posts of the user, we are already making a query function in homepage.jsx no need to make it here as well, magic of tanstack ig haha
    // but the catch is you have to first visit the homepage to get the posts
    const { data: posts, isLoading: isPostsLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            const response = await axiosInstance.get('/posts')
            return response.data
        },

        // dont fetch until we have authUser
        enabled: !!userData
    })

    // filter only the posts of the current user, since we want to display them in the profile page
    // only when the posts are readyy
    const postsOfCurrentUser = posts ? posts.filter((post) => post.author._id === userData._id) : []

    // log the posts of the current user
    console.log('all posts but in the profile page of the user', postsOfCurrentUser)



    return (
        <div className="bg-black p-4 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Posts by {userData.name}</h2>

            {/* if no posts print no posts yet */}
            {postsOfCurrentUser.length === 0 && <p className="p-2 text-neutral-500">No posts yet.</p>}

            {/* posts */}

            {postsOfCurrentUser.length > 0 && (
                <div className="p-3 rounded-md bg-neutral-900">
                    <div className="overflow-y-auto max-h-[400px] ">
                        <div className="min-w-full ">
                            {isPostsLoading ? (
                                <p className="text-white">Loading posts...</p>
                            ) : (
                                postsOfCurrentUser.map((post) => (
                                    <div
                                        key={post._id}
                                        // on small screen post should be full width
                                        className="lg:w-2/3 mx-auto"
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
                                        <Post post={post} isProfilePage={true} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PostsInProfilePg
