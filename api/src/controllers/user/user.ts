import httpStatus from 'http-status';
import { Request, RequestHandler } from 'express';
import User from '../../models/User';
import Provider, { IProviderModel } from '../../models/Provider';
import APIError from '../../helpers/APIError';

const getDbUser = async (req: Request, extra?: any) => {
  const user = await User.findOne({ _id: req.user.id, ...extra });
  if (!user) {
    throw new APIError('User not found', httpStatus.NOT_FOUND, true);
  }

  return user;
};

const getUserDetails = async ({ query, isPublic = true }: any) => {
  const user = await User.findOne(query)
    .select('+email')
    .populate<{
      providers: {
        permalink: string;
        provider: IProviderModel;
      }[];
    }>('providers.provider', 'name icon url urlAmount')
    .lean();

  if (!user) {
    throw new APIError('User not found', httpStatus.NOT_FOUND, true);
  }

  const result = {
    name: user.name,
    permalink: user.permalink,
    ...(!isPublic && { email: user.email }),
    providers:
      user.providers
        ?.filter((provider) => !isPublic || !!provider.permalink)
        .map((provider) => ({
          ...provider.provider,
          permalink: provider.permalink,
        })) || [],
  };

  return result;
};

export const getProviders: RequestHandler = async (req, res) => {
  const result = await getUserDetails({
    query: { permalink: req.params.permalink },
  });

  res.json(result);
};

export const getUser: RequestHandler = async (req, res) => {
  const result = await getUserDetails({
    query: { _id: req.user.id },
    isPublic: false,
  });

  res.json(result);
};

export const setUserDetails: RequestHandler = async (req, res) => {
  const { permalink, name } = req.body;
  try {
    await User.updateOne({ _id: req.user.id }, { permalink, name });
  } catch (err) {
    throw new APIError(
      'Url already in use. Please try another.',
      httpStatus.BAD_REQUEST,
      true
    );
  }
  res.json({
    success: true,
  });
};

export const getAvailableProviders: RequestHandler = async (req, res) => {
  const user = await getDbUser(req);
  const providers = await Provider.find({
    _id: { $nin: user.providers.map((p) => p.provider) },
    public: true,
  });

  res.json({ providers });
};

export const getProvider: RequestHandler = async (req, res, next) => {
  const user = await User.findOne({
    _id: req.user.id,
    'providers.provider': req.params.provider,
  }).populate<{ providers: any[] }>('providers.provider');

  if (!user) {
    return next(new APIError('User not found', httpStatus.NOT_FOUND, true));
  }

  const foundProvider = user.providers.find(
    (p) => p.provider._id.toString() === req.params.provider
  );
  const provider = foundProvider.provider;

  res.json({
    provider: {
      name: provider.name,
      permalink: foundProvider.permalink,
      icon: provider.icon,
      url: provider.url,
    },
  });
};

export const saveProvider: RequestHandler = async (req, res) => {
  const user = await getDbUser(req, {
    'providers.provider': req.params.provider,
  });

  user.providers.find(
    (p) => p.provider.toString() === req.params.provider
  ).permalink = req.body.permalink;
  await user.save();

  res.json({ success: true });
};

export const addProvider: RequestHandler = async (req, res) => {
  const user = await getDbUser(req);

  if (
    !user.providers.find((p) => p.provider.toString() === req.params.provider)
  ) {
    user.providers.push({ provider: req.params.provider });
    await user.save();
  }

  res.json({ success: true });
};

export const removeProvider: RequestHandler = async (req, res) => {
  await getDbUser(req);

  await User.updateOne(
    { _id: req.user.id },
    { $pull: { providers: { provider: req.params.provider } } }
  );

  res.json({ success: true });
};

export const updateProviderOrder: RequestHandler = async (req, res) => {
  const user = await getDbUser(req);

  const { oldIndex, newIndex } = req.body;

  const provider = user.providers.findIndex(
    (p) => p.provider.toString() === req.params.provider
  );

  if (provider === -1 || oldIndex !== provider) {
    throw new APIError('Provider not found', httpStatus.NOT_FOUND, true);
  }

  user.providers.splice(newIndex, 0, user.providers.splice(oldIndex, 1)[0]);
  await user.save();

  res.json({ success: true });
};
