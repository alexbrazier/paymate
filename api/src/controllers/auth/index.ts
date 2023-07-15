import express from 'express';
import { validate } from 'express-validation';
import passport from 'passport';
import userValidation from '../user/validation';
import * as auth from './auth';
import asyncMiddleware from '../../middleware/async';

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/login')
  .post(validate(userValidation.login), asyncMiddleware(auth.login));
router
  .route('/callback')
  .post(validate(userValidation.callback), asyncMiddleware(auth.callback));

router.post(
  '/login/password',
  passport.authenticate('local', {
    session: false,
  }),
  asyncMiddleware(auth.passwordLoginCallback)
);

router.post(
  '/register',
  validate(userValidation.register),
  asyncMiddleware(auth.register)
);

router.get('/check', asyncMiddleware(auth.check));

export default router;
