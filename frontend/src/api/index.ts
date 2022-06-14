import axios from 'axios';

const apiUrl =
  typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_SERVER_API_URL || 'http://localhost:8000/api'
    : '/api';

const api = axios.create({
  baseURL: apiUrl,
});

const getHeaders = () => {
  const token = localStorage.getItem('token');

  return { Authorization: `Bearer ${token}` };
};

export const getUser = (permalink: string) => api.get(`/user/${permalink}`);

export const login = (email: string) => api.post('/auth/login', { email });

export const verifyToken = (token: string) =>
  api.get('/auth/callback', { params: { token } });

export const accountDetails = () => {
  return axios.get('/api/user', {
    headers: getHeaders(),
  });
};

export const setDetails = details => {
  return axios.post('/api/user', details, {
    headers: getHeaders(),
  });
};

export const getAvailableProviders = () => {
  return axios.get('/api/user/available-providers', {
    headers: getHeaders(),
  });
};
export const getUserProvider = (provider: number | string) => {
  return axios.get(`/api/user/provider/${provider}`, {
    headers: getHeaders(),
  });
};
export const saveProvider = (provider: number | string, permalink: any) => {
  return axios.put(
    `/api/user/provider/${provider}`,
    { permalink },
    {
      headers: getHeaders(),
    }
  );
};
export const addProvider = (provider: number | string) => {
  return axios.post(`/api/user/provider/${provider}`, null, {
    headers: getHeaders(),
  });
};
export const removeProvider = (provider: number | string) => {
  return axios.delete(`/api/user/provider/${provider}`, {
    headers: getHeaders(),
  });
};

export const updateProviderOrder = (
  provider: number | string,
  oldIndex: number,
  newIndex: number
) => {
  return axios.put(
    `/api/user/provider/${provider}/order`,
    { oldIndex, newIndex },
    {
      headers: getHeaders(),
    }
  );
};
