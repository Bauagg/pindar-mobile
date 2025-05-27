import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

let navigationRef = null;

export const setNavigationRef = (navRef) => {
  navigationRef = navRef;
};

const api = axios.create({
  baseURL: 'https://be.pindar.id/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

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

        const res = await api.post(
          '/auth/refresh-token',
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken = res.data?.data?.accessToken;

        if (newAccessToken) {
          await AsyncStorage.setItem('accessToken', newAccessToken);
          api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
          onRefreshed(newAccessToken);

          isRefreshing = false;
          return api(originalRequest);
        } else {
          throw new Error('Invalid refresh token response.');
        }
      } catch (refreshError) {
        console.log('Error refreshing token:', refreshError);
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');

        if (navigationRef) {
          navigationRef.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'AuthScreen' }],
            })
          );
        }

        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
