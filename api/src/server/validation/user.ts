import Joi from 'joi';

export default {
  login: {
    body: {
      email: Joi.string()
        .email()
        .lowercase()
        .required(),
    },
  },
  callback: {
    query: {
      token: Joi.string().required(),
    },
  },
  setUserDetails: {
    body: {
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
      name: Joi.string()
        .min(1)
        .max(80)
        .required(),
    },
  },
  saveProvider: {
    body: {
      permalink: Joi.string()
        .lowercase()
        .required(),
    },
  },
  updateOrder: {
    body: {
      oldIndex: Joi.number()
        .min(0)
        .required(),
      newIndex: Joi.number()
        .min(0)
        .required(),
    },
  },
};
