import { IConfig } from '.';

const config: Partial<IConfig> = {
  env: 'production',
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT ? Number(process.env.PORT) : 8000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'paymate',
    pass: process.env.DB_PASS,
    db: process.env.DB_DB || 'paymate',
  },
};

export default config;
