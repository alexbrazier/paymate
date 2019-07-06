import config from './config/env';
import app from './config/express';
import logger from './config/winston';

if (config.email && config.email.user && config.email.pass) {
  logger.info('Email sending active');
} else {
  logger.warn('Email sending disabled');
}

app.listen(config.port, () => {
  logger.info(`server started on port ${config.port} (${config.env})`);
});

export default app;
