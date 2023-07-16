import express from 'express';
import { expressjwt } from 'express-jwt';
import { validate } from 'express-validation';
import * as userCtrl from './user';
import config from '../../config/env';
import asyncMiddleware from '../../middleware/async';
import userValidation from './validation';
import APIError from '../../helpers/APIError';
import httpStatus from 'http-status';

const router = express.Router(); // eslint-disable-line new-cap

const requireAuth = expressjwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  requestProperty: 'user',
  getToken: (req) => {
    if (req.headers.authorization) {
      const [scheme, token] = req.headers.authorization.split(' ');
      if (scheme === 'Bearer') {
        return token;
      }
    }
    if (req.cookies && req.cookies.access_token) {
      if (req.method !== 'GET') {
        const csrfToken = req.cookies.csrf_token;

        if (!csrfToken || req.headers['x-csrf-token'] !== csrfToken) {
          throw new APIError(
            'Invalid CSRF token',
            httpStatus.BAD_REQUEST,
            true
          );
        }
      }
      return req.cookies.access_token;
    }
    return null;
  },
});

router
  .route('/')
  .get(requireAuth, asyncMiddleware(userCtrl.getUser))
  .post(
    requireAuth,
    validate(userValidation.setUserDetails),
    asyncMiddleware(userCtrl.setUserDetails)
  );
router
  .route('/available-providers')
  .get(requireAuth, asyncMiddleware(userCtrl.getAvailableProviders));
router
  .route('/provider/:provider')
  .get(requireAuth, asyncMiddleware(userCtrl.getProvider))
  .delete(requireAuth, asyncMiddleware(userCtrl.removeProvider))
  .post(requireAuth, asyncMiddleware(userCtrl.addProvider))
  .put(
    requireAuth,
    validate(userValidation.saveProvider),
    asyncMiddleware(userCtrl.saveProvider)
  );
router
  .route('/provider/:provider/order')
  .put(
    requireAuth,
    validate(userValidation.updateOrder),
    asyncMiddleware(userCtrl.updateProviderOrder)
  );
router.route('/:permalink').get(asyncMiddleware(userCtrl.getProviders));

export default router;
