import { RequestHandler } from 'express';
import Provider from '../../models/Provider';

export const get: RequestHandler = async (req, res) => {
  const providers = await Provider.find({ public: true });
  res.json({ providers });
};
