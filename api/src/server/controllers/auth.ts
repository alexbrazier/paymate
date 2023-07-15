import util from 'util';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { IRequest, IResponse } from '../../types';
import APIError from '../helpers/APIError';
import User from '../models/User';
import { sendMagicLinkEmail } from '../helpers/Mailer';
import config from '../../config/env';
import { RequestHandler } from 'express';

const verifyJwt = util.promisify(jwt.verify) as any;

export const login2: RequestHandler = async (req, res) => {
  const user = req.user as any;
  const result = signJwt(user.id, user.email);

  res.json(result);
};

const signJwt = (id: string, email: string) => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 5; // 5 hours
  const token = jwt.sign(
    {
      id: id,
      email: email,
      exp,
      type: 'auth',
    },
    config.jwtSecret
  );

  return {
    email,
    token,
    exp,
  };
};

export const register: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw new APIError('User already exists', httpStatus.BAD_REQUEST, true);
  }

  const u = new User({ email, password });
  await u.save();

  const result = signJwt(u.id, u.email);

  res.json(result);
};

export const check: RequestHandler = async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({ email }).select('password');

  if (!user) {
    res.json({ exists: false });
  } else {
    res.json({ exists: true, password: !!user.password });
  }
};

export async function login(req: IRequest, res: IResponse) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    const u = new User({ email });
    await u.save();
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
    const user = await User.findOne({ email: decoded.email }).select('+email');

    const result = signJwt(user.id, user.email);

    res.json(result);
  } catch (err) {
    throw new APIError(
      'Your token is either invalid or has expired',
      httpStatus.UNAUTHORIZED,
      true
    );
  }
}
