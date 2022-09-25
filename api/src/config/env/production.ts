export default {
  env: 'production',
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'paymate',
    password: process.env.DB_PASS,
    database: process.env.DB_DB || 'paymate',
  },
};
