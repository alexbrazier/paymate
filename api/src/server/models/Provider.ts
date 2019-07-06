import db from '../../config/db';

const TABLE = 'providers';

export function availableProviders(userId: string) {
  return db(TABLE)
    .whereNotIn(
      'id',
      db('user_providers')
        .where({ user_id: userId })
        .whereNotNull('permalink')
        .orderBy('order')
        .select('provider_id')
    )
    .select('*');
}
export function get(name: string) {
  return db(TABLE)
    .where({ name })
    .first()
    .select('*');
}
