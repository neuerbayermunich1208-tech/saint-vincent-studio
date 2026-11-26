import * as migration_20261126_024839_initial from './20261126_024839_initial';
import * as migration_20261126_030818_vercel_blob from './20261126_030818_vercel_blob';

export const migrations = [
  {
    up: migration_20261126_024839_initial.up,
    down: migration_20261126_024839_initial.down,
    name: '20261126_024839_initial',
  },
  {
    up: migration_20261126_030818_vercel_blob.up,
    down: migration_20261126_030818_vercel_blob.down,
    name: '20261126_030818_vercel_blob'
  },
];
