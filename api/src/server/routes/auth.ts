import express from 'express';
import { validate } from 'express-validation';
import userValidation from '../validation/user';
import { login, callback } from '../controllers/auth';
import asyncMiddleware from '../middleware/async';

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/login')
  .post(validate(userValidation.login), asyncMiddleware(login));
router
  .route('/callback')
  .get(validate(userValidation.callback), asyncMiddleware(callback));

export default router;
