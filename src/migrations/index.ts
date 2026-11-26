import * as migration_20261126_024839_initial from './20261126_024839_initial';
import * as migration_20261126_030818_vercel_blob from './20261126_030818_vercel_blob';
import * as migration_20261126_033442_orders_checkout from './20261126_033442_orders_checkout';
import * as migration_20261126_162938_product_page_fields from './20261126_162938_product_page_fields';

export const migrations = [
  {
    up: migration_20261126_024839_initial.up,
    down: migration_20261126_024839_initial.down,
    name: '20261126_024839_initial',
  },
  {
    up: migration_20261126_030818_vercel_blob.up,
    down: migration_20261126_030818_vercel_blob.down,
    name: '20261126_030818_vercel_blob',
  },
  {
    up: migration_20261126_033442_orders_checkout.up,
    down: migration_20261126_033442_orders_checkout.down,
    name: '20261126_033442_orders_checkout',
  },
  {
    up: migration_20261126_162938_product_page_fields.up,
    down: migration_20261126_162938_product_page_fields.down,
    name: '20261126_162938_product_page_fields'
  },
];
