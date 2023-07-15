import express from 'express';
import httpStatus from 'http-status';
import userRoutes from './user';
import authRoutes from './auth';
import providerRoutes from './provider';
import { IRequest, IResponse, INextFunction } from '../../types';
import APIError from '../helpers/APIError';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health', (req, res) => res.json({ OK: true }));
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/provider', providerRoutes);

// catch 404 and forward to error handler
router.use((req: IRequest, res: IResponse, next: INextFunction) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND);
  return next(err);
});

export default router;
