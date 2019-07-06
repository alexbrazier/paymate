import util from 'util';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { IRequest, IResponse, INextFunction } from '../../types';
import APIError from '../helpers/APIError';
import * as User from '../models/User';
import { sendMagicLinkEmail } from '../helpers/Mailer';
import config from '../../config/env';

const verifyJwt = util.promisify(jwt.verify);

export async function login(req: IRequest, res: IResponse) {
  const { email } = req.body;
  const user = await User.get(email);
  if (!user) {
    await User.add({ email });
  }

  const token = jwt.sign(
    {
      email,
      exp: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes
      type: 'login',
    },
    config.jwtSecret
  );

  const link = `${config.host}/account/login?token=${token}`;

  sendMagicLinkEmail({ link, email });
  res.json({ success: true });
}

export async function callback(req: IRequest, res: IResponse) {
  const { token } = req.query;
  try {
    const decoded: any = await verifyJwt(token, config.jwtSecret);
    if (decoded.type !== 'login') {
      throw new Error('Invalid jwt type');
    }
    const user = await User.get(decoded.email);
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 5; // 5 hours
    const authToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: decoded.email,
        exp,
        type: 'auth',
      },
      config.jwtSecret
    );
    res.json({
      email: decoded.email,
      token: authToken,
      exp,
    });
  } catch (err) {
    throw new APIError(
      'Your token is either invalid or has expired',
      httpStatus.UNAUTHORIZED,
      true
    );
  }
}
