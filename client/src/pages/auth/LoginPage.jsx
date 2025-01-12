import React from 'react'
import LoginForm from '../../components/auth/LoginForm'
import { Link } from 'react-router-dom'

const LoginPage = () => {
    return (
        <div className='min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <img className='mx-auto h-36 w-auto' src='/logo.svg' alt='Locked In' />
                <h2 className=' text-center text-3xl font-extrabold text-white'>Log in to your account</h2>
            </div>

            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
                <div className='bg-base-300 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <LoginForm />
                    <div className='mt-6'>
                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-black border-4'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-4 bg-black text-md text-white font-bold rounded-2xl py-2'>New to LinkedIn?</span>
                            </div>
                        </div>
                        <div className='mt-6'>
                            <Link
                                to='/signup'
                                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-sm  text-lg font-medium text-red-600 bg-black hover:bg-base-200'
                            >
                                Join now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
