import axios from 'axios';

const api = axios.create({
  baseURL: "https://hr-management-system-backend-7jw6.onrender.com",
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
