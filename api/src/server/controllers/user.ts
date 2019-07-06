import httpStatus from 'http-status';
import { IRequest, IResponse, INextFunction } from '../../types';
import * as User from '../models/User';
import * as Provider from '../models/Provider';
import APIError from '../helpers/APIError';

export async function getProviders(
  req: IRequest,
  res: IResponse,
  next: INextFunction
) {
  const { id = null, ...user } =
    (await User.getPublic(req.params.permalink)) || {};
  if (!id) {
    return next(new APIError('User not found', httpStatus.NOT_FOUND, true));
  }
  const providers = await User.getProviders(id);
  res.json({ ...user, providers });
}

export async function getUser(req: IRequest, res: IResponse) {
  const user = await User.get(req.user.email);
  const providers = await User.getProviders(user.id);
  res.json({ ...user, providers });
}

export async function setUserDetails(req: IRequest, res: IResponse) {
  const { permalink, name } = req.body;
  const user = await User.update(req.user.email, { permalink, name });
  res.json(user);
}

export async function getAvailableProviders(req: IRequest, res: IResponse) {
  const { id } = await User.get(req.user.email);

  const providers = await Provider.availableProviders(id);
  res.json({ providers });
}

export async function getProvider(req: IRequest, res: IResponse) {
  const { id } = await User.get(req.user.email);
  const provider = await User.getProvider(id, req.params.provider);
  res.json({ provider });
}

export async function saveProvider(req: IRequest, res: IResponse) {
  const { id } = await User.get(req.user.email);
  await User.saveProvider(id, req.params.provider, req.body.permalink);
  res.json({ success: true });
}
export async function addProvider(req: IRequest, res: IResponse) {
  const { id } = await User.get(req.user.email);
  await User.addProvider(id, req.params.provider);
  res.json({ success: true });
}

export async function removeProvider(req: IRequest, res: IResponse) {
  const { id } = await User.get(req.user.email);
  await User.removeProvider(id, req.params.provider);
  res.json({ success: true });
}

export async function updateProviderOrder(req: IRequest, res: IResponse) {
  const { id } = await User.get(req.user.email);
  const { oldIndex, newIndex } = req.body;
  await User.updateProviderOrder(id, req.params.provider, oldIndex, newIndex);
  res.json({ success: true });
}
