export * from '../common';
import { t, Value, Filesize } from '../common';

/**
 * Constants
 */
export const FIELDS: t.CrdtInfoFields[] = [
  'Module',
  'Driver',
  'File',
  'History.Total',
  'History.Item',
];

const fields = ['Module'] as t.CrdtInfoFields[];
export const DEFAULTS = { fields } as const;

export const Wrangle = {
  displayHash(hash: string, length: number | [number, number]) {
    const lengths = Array.isArray(length) ? length : [length, length];
    const left = hash.slice(0, lengths[0]);
    const right = hash.slice(0 - lengths[1]);
    return `${left} .. ${right}`;
  },

  filesTotal(total: number, bytes: number) {
    const totalSuffix = Value.plural(total, 'file', 'files');
    const size = Filesize(bytes);
    return `${total.toLocaleString()} ${totalSuffix}, ${size}`;
  },
};
