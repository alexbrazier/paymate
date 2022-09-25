import httpStatus from 'http-status';
import { IRequest, IResponse } from '../../types';
import User from '../models/User';
import Provider from '../models/Provider';
import APIError from '../helpers/APIError';

const getUserDetails = async ({ query, isPublic = true }: any) => {
  const user = await User.findOne(query)
    .populate<{ providers: any }>('providers.provider')
    .lean();
  if (!user) {
    throw new APIError('User not found', httpStatus.NOT_FOUND, true);
  }

  const result = {
    name: user.name,
    permalink: user.permalink,
    providers: user.providers
      .filter((provider) => !isPublic || !!provider.permalink)
      .map((provider) => ({
        ...provider.provider,
        permalink: provider.permalink,
      })),
  };

  return result;
};

export async function getProviders(req: IRequest, res: IResponse) {
  const result = await getUserDetails({
    query: { permalink: req.params.permalink },
  });

  res.json(result);
}

export async function getUser(req: IRequest, res: IResponse) {
  const result = await getUserDetails({
    query: { email: req.user.email },
    isPublic: false,
  });

  res.json(result);
}

export async function setUserDetails(req: IRequest, res: IResponse) {
  const { permalink, name } = req.body;
  const user = await User.updateOne(
    { email: req.user.email },
    { permalink, name }
  );
  res.json(user);
}

export async function getAvailableProviders(req: IRequest, res: IResponse) {
  const user = await User.findOne({ email: req.user.email });
  const providers = await Provider.find({ _id: { $nin: user.providers } });

  res.json({ providers });
}

export async function getProvider(req: IRequest, res: IResponse, next) {
  const user = await User.findOne({
    email: req.user.email,
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
}

export async function saveProvider(req: IRequest, res: IResponse, next) {
  const user = await User.findOne({
    email: req.user.email,
    'providers.provider': req.params.provider,
  });

  if (!user) {
    return next(new APIError('User not found', httpStatus.NOT_FOUND, true));
  }
  user.providers.find(
    (p) => p.provider.toString() === req.params.provider
  ).permalink = req.body.permalink;
  await user.save();

  res.json({ success: true });
}
export async function addProvider(req: IRequest, res: IResponse, next) {
  const user = await User.findOne({ email: req.user.email });

  if (!user) {
    return next(new APIError('User not found', httpStatus.NOT_FOUND, true));
  }

  if (!user.providers.find((p) => p.provider === req.params.provider)) {
    user.providers.push({ provider: req.params.provider });
    await user.save();
  }

  res.json({ success: true });
}

export async function removeProvider(req: IRequest, res: IResponse, next) {
  const user = await User.findOne({ email: req.user.email });

  if (!user) {
    return next(new APIError('User not found', httpStatus.NOT_FOUND, true));
  }

  await User.updateOne(
    { email: req.user.email },
    { $pull: { providers: { provider: req.params.provider } } }
  );

  res.json({ success: true });
}

export async function updateProviderOrder(req: IRequest, res: IResponse) {
  const user = await User.findOne({ email: req.user.email });

  if (!user) {
    throw new APIError('User not found', httpStatus.NOT_FOUND, true);
  }

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
}
