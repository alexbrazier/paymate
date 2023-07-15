import express from 'express';
import { validate } from 'express-validation';
import passport from 'passport';
import userValidation from '../validation/user';
import * as auth from '../controllers/auth';
import asyncMiddleware from '../middleware/async';

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/login')
  .post(validate(userValidation.login), asyncMiddleware(auth.login));
router
  .route('/callback')
  .post(validate(userValidation.callback), asyncMiddleware(auth.callback));

router.route('/login2').post(asyncMiddleware(auth.login2));

router.post(
  '/login/password',
  passport.authenticate('local', {
    session: false,
  }),
  asyncMiddleware(auth.login2)
);

router.post(
  '/register',
  validate(userValidation.register),
  asyncMiddleware(auth.register)
);

router.get('/check', asyncMiddleware(auth.check));

export default router;
