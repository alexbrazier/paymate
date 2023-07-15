import Joi from 'joi';
import fs from 'fs';
import path from 'path';

const bannedPermalinks = fs
  .readFileSync(path.join(__dirname, 'bannedPermalinks.txt'), 'utf8')
  .split('\n');

export default {
  login: {
    body: Joi.object({
      email: Joi.string().email().lowercase().required(),
    }),
  },
  callback: {
    body: Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(8),
    }),
  },
  setUserDetails: {
    body: Joi.object({
      permalink: Joi.string()
        .min(4)
        .max(30)
        .regex(/^[a-z]+\d{0,3}$/, { name: 'permalink' })
        .lowercase()
        .disallow(...bannedPermalinks)
        .required(),
      name: Joi.string().min(1).max(80).required(),
    }),
  },
  saveProvider: {
    body: Joi.object({
      permalink: Joi.string().lowercase().required(),
    }),
  },
  updateOrder: {
    body: Joi.object({
      oldIndex: Joi.number().min(0).required(),
      newIndex: Joi.number().min(0).required(),
    }),
  },
  register: {
    body: Joi.object({
      email: Joi.string().email().lowercase().required(),
      password: Joi.string().min(8).required(),
    }),
  },
};
