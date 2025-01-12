import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../../libs/axios';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const SignUpForm = () => {
    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // client query
    const queryClient = useQueryClient();

    // Mutation for signup
    const { mutate: signUpMutation, isLoading } = useMutation({
        mutationFn: async (data) => {
            const response = await axiosInstance.post('/auth/signup', data);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Account created successfully');
            // invalidate that query, so that we can be redirected to home page after signing up
            // is invalidate that data so that page is reloaded and redirected to homepg
            queryClient.invalidateQueries({ queryKey: ['authUser'] })
        },
        onError: (error) => {
            toast.error(error.response?.data?.Message || 'Something went wrong');
            console.log(error);
        },
    });

    const handleSignUp = (e) => {
        e.preventDefault(); // Prevent page reload
        signUpMutation({ name, email, username, password });
    };

    return (
        <form onSubmit={handleSignUp} className="space-y-4">
            <div className="font-bold text-3xl flex justify-center text-white tracking-wide">Sign Up</div>
            <div>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full text-red-600"
                    required
                />
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered w-full text-red-600"
                    required
                />
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input input-bordered w-full text-red-600"
                    required
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password (8 characters minimum)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input input-bordered w-full text-red-600"
                    required
                />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn btn-primary w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-sm shadow-sm text-lg font-medium text-red-600 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-base-200'
                        }`}
                >
                    {isLoading ? (
                        <Loader className="size-5 animate-spin mr-2" />
                    ) : (
                        'Agree & Join'
                    )}
                </button>
            </div>
        </form>
    );
};

export default SignUpForm;
