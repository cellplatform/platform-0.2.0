export * from '../common';
import { t, Value, Filesize, DEFAULTS as DEFAULTS_BASE } from '../common';

/**
 * Constants
 */
export const FIELDS: t.CrdtInfoFields[] = [
  'Module',
  'Module.Verify',
  'Driver.Library',
  'Driver.Runtime',
  'History',
  'History.Item',
  'History.Item.Message',
  'File',
  'File.Driver',
  'Network',
  'Url',
  'Url.QRCode',
];

const defaultFields = ['Module', 'Module.Verify'] as t.CrdtInfoFields[];
export const DEFAULTS = {
  fields: defaultFields,
  indent: 15,
  doc: DEFAULTS_BASE.doc,
  query: DEFAULTS_BASE.query,
} as const;

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
