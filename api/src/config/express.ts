import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import httpStatus from 'http-status';
import expressWinston from 'express-winston';
import expressValidation from 'express-validation';
import helmet from 'helmet';
import winstonInstance from './winston';
import routes from '../controllers';
import config from './env';
import APIError from '../helpers/APIError';
import rateLimiterMiddleware from '../middleware/rateLimiter';
import './passport';

const app = express();

if (config.env === 'development') {
  app.use(logger('dev'));
}

app.use(express.static('public'));
app.use(rateLimiterMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());

// enable detailed API logging in dev env
if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  app.use(
    expressWinston.logger({
      winstonInstance,
      meta: true, // optional: log meta data about request (defaults to true)
      msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      colorize: true,
    })
  );
}

// mount all routes on /api path
app.use('/api', routes);

// Serve react app for every non api request
app.get('*', (req, res) => {
  res.status(200).sendFile('public/index.html', { root: process.cwd() });
});

// if error is not an instanceOf APIError, convert it.
app.use(
  (
    err: expressValidation.ValidationError | APIError | any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof expressValidation.ValidationError) {
      const errors = [];
      Object.keys(err.details).forEach((key) => {
        errors.push(...err.details[key].map((error) => error.message));
      });

      const message = `${err.message}${
        errors.length ? `: ${errors.join(', ')}` : ''
      }`;

      const error = new APIError(message, 400, true);
      return next(error);
    } else if (!(err instanceof APIError)) {
      const apiError = new APIError(err.message, err.status, err.isPublic);
      apiError.stack =
        apiError.stack.split('\n').slice(0, 2).join('\n') + '\n' + err.stack;
      return next(apiError);
    }
    return next(err);
  }
);

// log error in winston transports except when executing test suite
if (config.env !== 'test') {
  app.use(
    expressWinston.errorLogger({
      winstonInstance,
    })
  );
}

// error handler, send stacktrace only during development
app.use(
  (
    err: APIError,
    req: Request,
    res: Response,
    next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
  ) =>
    res.status(err.status).json({
      message: err.isPublic ? err.message : httpStatus[err.status],
      stack: config.env === 'development' ? err.stack : {},
    })
);

export default app;
