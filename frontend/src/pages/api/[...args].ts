import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = createProxyMiddleware({
  target: 'http://localhost:8000',
  changeOrigin: true,
});

export default process.env.NODE_ENV !== 'production' ? proxy : undefined;
