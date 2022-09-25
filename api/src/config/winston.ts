import winston, { format } from 'winston';

const devFormat = format((info: any) => {
  const error = info.meta?.message;
  delete info.meta;
  if (error) {
    return {
      ...info,
      error,
    };
  }
  return info;
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(
      process.env.NODE_ENV !== 'production'
        ? {
            format: format.combine(
              devFormat(),
              format.colorize(),
              format.simple()
            ),
          }
        : {
            format: format.combine(
              format.timestamp(),
              format.json(
                process.env.NODE_ENV !== 'production' ? { space: 2 } : {}
              )
            ),
          }
    ),
  ],
});
export default logger;
