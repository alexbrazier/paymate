import httpStatus from 'http-status';
import db from '../../config/db';
import APIError from '../helpers/APIError';

const TABLE = 'users';

export function get(email: string) {
  return db(TABLE)
    .where({ email })
    .select('*')
    .first();
}

export function getPublic(permalink: string) {
  return db(TABLE)
    .where({ permalink })
    .select(['id', 'name', 'permalink'])
    .first();
}

export function add({ email }) {
  return db(TABLE).insert({
    email,
  });
}

export function getProviders(userId: number) {
  return db('user_providers')
    .where({ user_id: userId })
    .whereNotNull('permalink')
    .innerJoin('providers', 'user_providers.provider_id', 'providers.id')
    .orderBy('order')
    .select(['providers.id', 'name', 'icon', 'permalink', 'url', 'url_amount']);
}

export function getProvider(userId: number, providerId: string) {
  return db('user_providers')
    .where({ user_id: userId, provider_id: providerId })
    .innerJoin('providers', 'user_providers.provider_id', 'providers.id')
    .first()
    .select(['providers.id', 'name', 'icon', 'permalink']);
}
export function saveProvider(
  userId: number,
  providerId: string,
  permalink: string
) {
  return db('user_providers')
    .update({ permalink })
    .where({ user_id: userId, provider_id: providerId });
}
export async function addProvider(userId: number, providerId: string) {
  const exists = await db('user_providers')
    .where({ user_id: userId, provider_id: providerId })
    .first();
  if (exists) {
    return exists;
  }
  const result = await db('user_providers')
    .where({ user_id: userId })
    .count('* as order');
  const order = result[0].order;
  return db('user_providers').insert({
    user_id: userId,
    provider_id: providerId,
    order,
  });
}
export async function removeProvider(userId: number, providerId: string) {
  const { order } = await db('user_providers')
    .where({ user_id: userId, provider_id: providerId })
    .first()
    .select('order');
  console.log(order);

  await db('user_providers')
    .where({ user_id: userId, provider_id: providerId })
    .delete();
  return db('user_providers')
    .where({ user_id: userId })
    .where('order', '>', order)
    .decrement('order', 1);
}

export async function updateProviderOrder(
  userId: number,
  providerId: string,
  oldIndex: number,
  newIndex: number
) {
  if (oldIndex > newIndex) {
    await db('user_providers')
      .where({ user_id: userId })
      .whereBetween('order', [newIndex, oldIndex])
      .increment('order', 1);
  } else if (oldIndex < newIndex) {
    await db('user_providers')
      .where({ user_id: userId })
      .whereBetween('order', [oldIndex + 1, newIndex])
      .decrement('order', 1);
  }

  return await db('user_providers')
    .where({ user_id: userId, provider_id: providerId })
    .update({ order: newIndex });
}

interface IUpdate {
  name: string;
  permalink: string;
}

export async function update(email: string, { name, permalink }: IUpdate) {
  const existingPermalink = await db(TABLE)
    .where({ permalink })
    .whereNot({ email })
    .first();
  if (existingPermalink) {
    throw new APIError(
      `${permalink} has already been taken.`,
      httpStatus.BAD_REQUEST,
      true
    );
  }
  return db(TABLE)
    .update({ name, permalink })
    .where({ email });
}
