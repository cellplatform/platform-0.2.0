/**
 * @external
 */
import { clone, flatten, uniq } from 'ramda';
export const R = { clone, uniq, flatten } as const;

/**
 * @system
 */
export {
  Delete,
  Filesize,
  Hash,
  Is,
  Json,
  Mime,
  Sort,
  Stream,
  Time,
  asArray,
  cuid,
  rx,
  slug,
} from 'sys.util';
