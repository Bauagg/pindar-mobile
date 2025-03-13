import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://be.pindar.id/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// State untuk menangani refresh token
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// Interceptor untuk menangani request
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk menangani response error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika error 401 (Unauthorized), coba refresh token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const res = await axios.post(
          'https://be.pindar.id/api/auth/refresh-token',
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        if (res.data.success) {
          const newAccessToken = res.data.accessToken;

          await AsyncStorage.setItem('accessToken', newAccessToken);
          api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
          onRefreshed(newAccessToken);

          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
      }

      isRefreshing = false;
    }

    return Promise.reject(error);
  }
);

export default api;
