import axios from 'axios'

export const axiosInstance = axios.create({
    // if we are in development mode, we want to use localhost else the domain name
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:3000/api/v1' : '/api/v1',
    withCredentials: true // for cookies with credentials, this tells the backend that we are authenticated
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});