import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true // for cookies with credentials, this tells the backend that we are authenticated
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});