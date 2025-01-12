import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../libs/axios"
import toast from "react-hot-toast"
import { useState } from "react"
import { Image, Loader } from "lucide-react"

const PostCreation = ({ user }) => {
    // to create a post we will have to take the contents for the post, image and image preview
    const [content, setContent] = useState("")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)

    // we need query client to invalidate the query 
    const queryClient = useQueryClient()

    // we need mutation to create a post
    const { mutate: createPostMutation, isPending } = useMutation({
        mutationFn: async (postData) => {
            const response = await axiosInstance.post('/posts/create', postData)
            return response.data
        },
        onSuccess: () => {
            toast.success('Your post was sent successfully')
            resetForm()

            // invalidate the posts so that they can be fetched again and the new post we have created will be displayed
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Something went wrong')
        }
    })

    const handlePostCreation = async () => {
        try {
            const postData = { content }
            // check if image is uploaded, if yes add it
            // image base64 string encoded representation
            if (image) postData.image = await readFileAsDataURL(image);

            createPostMutation(postData)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong')
            console.log(error)
        }
    }

    // reset post form, we reset the form after post is successfully created
    const resetForm = () => {
        setContent("")
        setImage(null)
        setImagePreview(null)
    }

    // function to read the contents of thefile, we need this so that we can set the preview of the image
    // string representation of the image
    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // to handle img change when user selects diff img from his computer 
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            readFileAsDataURL(file).then(setImagePreview)
            setImage(file)
        } else {
            setImagePreview(null)
        }
    }
    return (
        <div className='bg-primary rounded-lg shadow mb-4 p-4'>
            <div className='flex space-x-3'>
                <img src={user.profilePicUrl || "/avatar.png"} alt={user.name} className='size-12 rounded-full' />
                <textarea
                    placeholder="What's on your mind?"
                    className='w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            {imagePreview && (
                <div className='mt-4'>
                    <img src={imagePreview} alt='Selected' className='w-full h-auto rounded-lg' />
                </div>
            )}

            <div className='flex justify-between items-center mt-4'>
                <div className='flex space-x-4'>
                    <label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
                        <Image size={20} className='mr-2' />
                        <span>Photo</span>
                        <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
                    </label>
                </div>

                <button
                    className='bg-secondary text-white rounded-lg px-4 py-2 hover:bg-neutral-800 transition-colors duration-200'
                    onClick={handlePostCreation}
                    disabled={isPending}
                >
                    {isPending ? <Loader className='size-5 animate-spin' /> : "Share"}
                </button>
            </div>
        </div>

    )
}

export default PostCreation
