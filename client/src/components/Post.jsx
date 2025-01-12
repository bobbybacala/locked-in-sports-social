import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { axiosInstance } from "../libs/axios"
import toast from "react-hot-toast"
import { Link, useParams } from "react-router-dom"
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react"
import PostAction from "./PostAction"
import { formatDistanceToNow } from 'date-fns'

const Post = ({ post, defaultCommentsShow }) => {
    const { postId } = useParams()

    // queryclient to invalidate the data so that page is reloaded on an action
    const queryClient = useQueryClient()


    // we need the authenticated user, so that we can see whether the post is liked or not, and also comment on the post
    const { data: authUser } = useQuery({ queryKey: ['authUser'] })

    // we need states to keep track of comments on the post and etc
    const [showComments, setShowComments] = useState(defaultCommentsShow)
    const [newComment, setNewComment] = useState("")
    const [comments, setComments] = useState(post.comments || [])

    // to keep track whennever the post is liked
    const isLiked = post.likes.includes(authUser._id)
    const isOwner = post.author._id === authUser._id

    // mutate function to delete a post
    const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
        mutationFn: async () => {
            // hit the delete method w axios instance
            await axiosInstance.delete(`posts/delete/${post._id}`)
        },
        onSuccess: () => {
            toast.success('Post deleted successfully')
            // invalidate the posts so that they can be fetched again and the new post we have created will be displayed
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    })

    // mutate function to create a comment on a post
    const { mutate: createComment, isPending: isCreatingComment } = useMutation({
        mutationFn: async (newComment) => {
            // hit post method with axios instance to create the comment
            await axiosInstance.post(`posts/${post._id}/comment`, { comment: newComment })
        },
        onSuccess: () => {
            // invalidate the posts so that they can be fetched again and the new post we have created will be displayed
            queryClient.invalidateQueries({ queryKey: ['posts'] })

            // also invalidate the specific post
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
            toast.success('Comment created successfully')
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    })

    // mutate function to like a post
    const { mutate: likePost, isPending: isLikingPost } = useMutation({
        mutationFn: async () => {
            await axiosInstance.post(`posts/${post._id}/like`)
        },
        onSuccess: () => {
            // invalidate the posts so that they can be fetched again and the new post we have created will be displayed
            queryClient.invalidateQueries({ queryKey: ['posts'] })

            // also invalidate the specific post
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    })

    // function to handle deleting a post
    const handleDeletePost = () => {
        // ask for confirmation
        if (!window.confirm('Are you sure you want to delete this post?') || isDeletingPost) {
            return
        }
        deletePost()
    }

    // function to handle liking a post
    const handleLikePost = () => {
        if (isLikingPost) return
        likePost()
    }

    // function to handle commenting on a post
    const handleAddComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            createComment(newComment);
            setNewComment("");
            setComments([
                ...comments,
                {
                    content: newComment,
                    user: {
                        _id: authUser._id,
                        name: authUser.name,
                        profilePicUrl: authUser.profilePicUrl,
                    },
                    createdAt: new Date(),
                },
            ]);
        }

    }


    return (
        <div className="bg-black rounded-lg shadow mb-4">
            {/* the post part */}
            <div className='p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                        <Link to={`/profile/${post?.author?.username}`}>
                            <img
                                src={post.author.profilePicUrl || "/avatar.png"}
                                alt={post.author.name}
                                className='size-10 rounded-full mr-3'
                            />
                        </Link>

                        <div>
                            <Link to={`/profile/${post?.author?.username}`}>
                                <h3 className='font-semibold'>{post.author.name}</h3>
                            </Link>
                            <p className='text-xs text-info'>{post.author.headline}</p>
                            <p className='text-xs text-info'>
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    {isOwner && (
                        <button onClick={handleDeletePost} className='text-red-500 hover:text-red-700'>
                            {isDeletingPost ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18} />}
                        </button>
                    )}
                </div>
                <p className='mb-4'>{post.content}</p>
                {post.image && <img src={post.image} alt='Post content' className='rounded-lg w-full mb-4' />}

                <div className='flex justify-between text-info'>
                    <PostAction
                        icon={<ThumbsUp size={18} className={isLiked ? "text-red-600  fill-red-600" : ""} />}
                        text={`Like (${post.likes.length})`}
                        onClick={handleLikePost}
                    />

                    <PostAction
                        icon={<MessageCircle size={18} />}
                        text={`Comment (${comments.length})`}
                        onClick={() => setShowComments(!showComments)}
                    />
                    <PostAction icon={<Share2 size={18} />} text='Share' />
                </div>
            </div>

            {/* showing of comments */}
            {showComments && (
                <div className="px-4 pb-4">
                    <div className="mb-4 ">
                        {/* map the comments */}
                        {comments.map((comment) => (
                            <div key={comment._id} className="mb-2 bg-base-100 p-2 rounded flex items-start">
                                <img
                                    src={comment.user.profilePicUrl || "/avatar.png"}
                                    alt={comment.user.name}
                                    className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
                                />
                                <div className='flex-grow'>
                                    <div className='flex items-center mb-1'>
                                        <span className='font-semibold mr-2'>{comment.user.name}</span>
                                        <span className='text-xs text-info'>
                                            {formatDistanceToNow(new Date(comment.createdAt))}
                                        </span>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* section to add a comment */}
                    <form
                        onSubmit={handleAddComment}
                        className='flex items-center'
                        // on click stop the propagation of the click event to the parent element, since we dont want to navigate to post page on click of this input
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type='text'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Add a comment...'
                            className='flex-grow p-3 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary'
                        />

                        <button
                            type='submit'
                            className='bg-black border border-base-100 p-3 rounded-r-full hover:bg-primary-dark transition duration-300 '
                            disabled={isCreatingComment}
                        >
                            {isCreatingComment ? <Loader size={18} className='animate-spin ' /> : <Send size={18} className="text-red-600" />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Post
