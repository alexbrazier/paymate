import path from 'path';
import configDev from './development';
import configProd from './production';
import configTest from './test';

const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  switch (env) {
    case 'development':
      return configDev;
    case 'production':
      return configProd;
    case 'test':
      return configTest;
    default:
      return { env };
  }
};

const config = getConfig();

export interface IConfig {
  root: string;
  db: {
    host: string;
    user?: string;
    pass?: string;
    db: string;
  };
  env: string;
  port: number;
  jwtSecret?: string;
  email?: {
    user: string;
    pass: string;
    host: string;
    port: number;
  };
  host: string;
  rateLimit: {
    points: number;
    duration: number;
  };
}

const defaults: IConfig = {
  env: 'development',
  root: path.join(__dirname, '/..'),
  port: 8000,
  db: {
    host: 'localhost',
    // user: 'root',
    // pass: 'Password123',
    db: 'paymate',
  },
  jwtSecret: '8e4a51a2-4563-4dd3-949e-5bc655b3eba8',
  host: process.env.HOST || 'http://localhost:3000',
  rateLimit: {
    points: Number(process.env.RATE_LIMIT_POINTS) || 20,
    duration: Number(process.env.RATE_LIMIT_DURATION) || 10,
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    host: process.env.EMAIL_HOST || 'smtp.eu.mailgun.org',
    port: Number(process.env.EMAIL_PORT) || 587,
  },
};

const finalConfig: IConfig = Object.assign({}, defaults, config);

export default finalConfig;
