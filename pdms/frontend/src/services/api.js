import axios from 'axios';

const api = axios.create({
    baseURL: 'https://parthmicrosys-dpy5.vercel.app/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor — attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('pdms_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (token expired)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('pdms_token');
            localStorage.removeItem('pdms_admin');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
