import express from 'express';
import * as provider from './provider';
import asyncMiddleware from '../../middleware/async';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/').get(asyncMiddleware(provider.get));

export default router;
