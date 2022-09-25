import mongoose, { model as mongooseModel } from 'mongoose';
import config from './env';
import logger from './winston';

const DB_URI = !config.db.user
  ? `mongodb://${config.db.host}/${config.db.db}`
  : `mongodb+srv://${config.db.user}:${config.db.pass}@${config.db.host}/${config.db.db}?retryWrites=true&w=majority`;

export const connection = mongoose
  .connect(DB_URI)
  .then(() => {
    logger.info(`Connected to db ${config.db.db}`);
  })
  .catch((err) => {
    logger.error(`DB Error: ${err.message}`, err);
  });

const db = mongoose.connection;

export const model: typeof mongooseModel = (a, b, c, d) => {
  const Model = mongooseModel(a, b, c, d);
  Model.on('index', function (err) {
    if (err) {
      logger.error(err.message, err);
    }
  });
  return Model;
};

export default db;
