import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';

const apiUrl =
  typeof window === 'undefined'
    ? process.env.BUILD_API_URL ||
      process.env.NEXT_PUBLIC_SERVER_API_URL ||
      'http://localhost:8000/api'
    : '/api';

export const api = axios.create({
  xsrfCookieName: 'csrf_token',
  xsrfHeaderName: 'x-csrf-token',
  baseURL: apiUrl,
});

type TokenInfo = { expires: number; issued: number } | undefined;

export const getTokenInfo = () => {
  const tokenInfo = Cookies.get('token_info');

  if (tokenInfo) {
    try {
      const result = JSON.parse(tokenInfo) as TokenInfo;

      return result;
    } catch (e) {
      // Ignore
    }
  }

  return undefined;
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Logout on UNAUTHORIZED unless login route
    const url = (error as AxiosError<any>)?.response?.config?.url;
    if (
      (error as AxiosError<any>)?.response?.status === 401 &&
      !url.startsWith('/auth/')
    ) {
      if (getTokenInfo()) {
        await api.post('/auth/logout');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    } else {
      return Promise.reject(error);
    }
  }
);

export const getUser = (permalink: string) => api.get(`/user/${permalink}`);

export const login = (email: string) => api.post('/auth/login', { email });

export const verifyToken = (token: string, password?: string) =>
  api.post('/auth/callback', { token, password });

export const accountDetails = () => api.get('/user');

export const setDetails = (details) => api.post('/user', details);

export const getAvailableProviders = () => api.get('/user/available-providers');

export const getUserProvider = (provider: number | string) =>
  api.get(`/user/provider/${provider}`);

export const saveProvider = (provider: number | string, permalink: any) =>
  api.put(`/user/provider/${provider}`, { permalink });

export const addProvider = (provider: number | string) =>
  api.post(`/user/provider/${provider}`);

export const removeProvider = (provider: number | string) =>
  api.delete(`/user/provider/${provider}`);

export const updateProviderOrder = (
  provider: number | string,
  oldIndex: number,
  newIndex: number
) => api.put(`/user/provider/${provider}/order`, { oldIndex, newIndex });
