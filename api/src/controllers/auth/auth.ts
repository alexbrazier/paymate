import util from 'util';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../../helpers/APIError';
import User from '../../models/User';
import { sendMagicLinkEmail } from '../../helpers/Mailer';
import config from '../../config/env';
import { RequestHandler } from 'express';
import logger from '../../config/winston';

const verifyJwt = util.promisify(jwt.verify) as any;

export const passwordLoginCallback: RequestHandler = async (req, res) => {
  const user = req.user as any;
  const result = signJwt(user.id, user.email);

  res.json(result);
};

const signJwt = (id: string, email: string) => {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 5; // 5 hours
  const token = jwt.sign(
    {
      id,
      email,
      exp,
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

export const login: RequestHandler = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  let u: any;
  if (!user) {
    u = new User({ email });
    await u.save();
  }

  const token = jwt.sign(
    {
      id: (user || u).id,
      exp: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutes
    },
    config.jwtSecretEmail
  );

  const link = `${config.host}/account/login?token=${token}`;

  sendMagicLinkEmail({ link, email });
  res.json({ success: true });
};

export const callback: RequestHandler = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded: any = await verifyJwt(token, config.jwtSecretEmail);
    const user = await User.findOne({ _id: decoded.id }).select('+email');

    if (!user) {
      throw new Error('User not found');
    }

    if (password) {
      user.password = password;
      await user.save();
    }

    const result = signJwt(user.id, user.email);

    res.json(result);
  } catch (err) {
    logger.error(err);
    throw new APIError(
      'Your token is either invalid or has expired',
      httpStatus.UNAUTHORIZED,
      true
    );
  }
};
