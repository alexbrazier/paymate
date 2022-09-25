import Joi from 'joi';

export default {
  login: {
    body: Joi.object({
      email: Joi.string().email().lowercase().required(),
    }),
  },
  callback: {
    query: Joi.object({
      token: Joi.string().required(),
    }),
  },
  setUserDetails: {
    body: Joi.object({
      permalink: Joi.string()
        .min(4)
        .max(30)
        .alphanum()
        .lowercase()
        .disallow(
          'about',
          'api',
          'account',
          'blog',
          'donate',
          'github',
          'help',
          'info',
          'issues',
          'legal',
          'notifications',
          'privacy',
          'security',
          'settings',
          'share',
          'shop',
          'status',
          'support',
          'terms',
          'translate'
        )
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
};
