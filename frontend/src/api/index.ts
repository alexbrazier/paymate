import axios from 'axios';

const getHeaders = () => {
  const token = localStorage.getItem('token');

  return { Authorization: `Bearer ${token}` };
};

export const getUser = (permalink: string) =>
  axios.get(`/api/user/${permalink}`);

export const login = (email: string) =>
  axios.post('/api/auth/login', { email });

export const verifyToken = (token: string) =>
  axios.get('/api/auth/callback', { params: { token } });

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
