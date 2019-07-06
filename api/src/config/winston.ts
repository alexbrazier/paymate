import winston from 'winston';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.json({ space: 2 }),
    }),
  ],
});
export default logger;
