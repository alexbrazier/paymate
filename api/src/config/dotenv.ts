import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;

const requiredEnvs = {
  JWT_SECRET,
};

Object.entries(requiredEnvs).map(([key, value]) => {
  if (!value) {
    throw new Error(
      `Missing required env "${key}". Create a .env file or set the env variable manually.`
    );
  }
});
