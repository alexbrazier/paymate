import path from 'path';

export interface IConfig {
  root: string;
  https: boolean;
  db: {
    host: string;
    user?: string;
    pass?: string;
    db: string;
  };
  env: string;
  port: string;
  jwtSecret: string;
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
  jwtSecretEmail: string;
}

const config: IConfig = {
  env: process.env.NODE_ENV || 'development',
  https: process.env.HTTPS === 'true' || process.env.NODE_ENV === 'production',
  root: path.join(__dirname, '/..'),
  port: process.env.PORT || '8000',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    db: process.env.DB_DB || 'paymate',
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretEmail:
    process.env.JWT_SECRET_EMAIL || `${process.env.JWT_SECRET}email`,
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

export default config;
