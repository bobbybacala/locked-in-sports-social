import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { axiosInstance } from '../../libs/axios'
import toast from 'react-hot-toast'
import { Loader } from 'lucide-react'

const LoginForm = () => {

    // we gonna need password and username for this form
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    // queryClient is used to invalidate the data so that page is reloaded and then we are directed to login page
    const queryClient = useQueryClient()

    // mutation for login
    const { mutate: loginMutation, isLoading } = useMutation({
        mutationFn: (userData) => axiosInstance.post('/auth/login', userData),
        onSuccess: () => {
            toast.success('Login successful');
            // invalidate the data so that page is reloaded and then we are directed to login page
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Something went wrong');
            console.log(error);
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        loginMutation({ username, password })
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
            <div className="font-bold text-3xl flex justify-center text-white tracking-wide">Sign In</div>
            <input
                type='text'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='input input-bordered w-full text-red-600'
                required
            />
            <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='input input-bordered w-full text-red-600'
                required
            />

            <button type='submit' className={`btn btn-primary w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-lg font-medium text-red-600 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-base-200'
                }`}>
                {isLoading ? <Loader className='size-5 animate-spin' /> : "Login"}
            </button>
        </form>
    )
}

export default LoginForm
