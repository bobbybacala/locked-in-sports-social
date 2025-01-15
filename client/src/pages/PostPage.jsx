import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../libs/axios"
import { Loader } from "lucide-react"
import Post from "../components/Post"
import Sidebar from "../components/Sidebar"

const PostPage = () => {
    // get the post id from the params of the URL
    const { postId } = useParams()

    // get the authUser
    const { data: authUser } = useQuery({
        queryKey: ['authUser']
    })

    // get the post by id
    const { data: post, isLoading } = useQuery({
        queryKey: ['post', postId],
        queryFn: () => axiosInstance.get(`/posts/${postId}`)
    })

    // if loading return loader
    if (isLoading) {
        return <div className="flex items-center justify-center ">
            <span>
                <Loader
                    className="animate-spin"
                    size={20}
                    strokeWidth={2}
                    color="red"
                />
            </span>
        </div>
    }

    // if post not found return 404
    if (!post?.data) {
        return <div className="flex items-center justify-center ">404 Post not found :(</div>
    }

    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='hidden lg:block lg:col-span-1'>
                <Sidebar user={authUser} />
            </div>

            <div className='col-span-1 lg:col-span-3'>
                <Post post={post.data} defaultCommentsShow={true} />
            </div>
        </div>
    )
}

export default PostPage
