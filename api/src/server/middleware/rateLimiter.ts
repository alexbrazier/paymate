import { RateLimiterMemory } from 'rate-limiter-flexible';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/env';

const rateLimiter = new RateLimiterMemory({
  points: config.rateLimit.points, // x requests
  duration: config.rateLimit.duration, // per y second by IP
});

const rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.headers['cf-connecting-ip'] || req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      next(
        new APIError('Too many requests', httpStatus.TOO_MANY_REQUESTS, true)
      );
    });
};

export default rateLimiterMiddleware;
