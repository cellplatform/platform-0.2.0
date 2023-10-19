import { DEFAULTS as DEFAULTS_BASE, Filesize, Value, type t } from '../common';

export * from '../common';

/**
 * Constants
 */
export const FIELDS: t.CrdtInfoField[] = [
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

const fields = ['Module', 'Module.Verify'] as t.CrdtInfoField[];

export const DEFAULTS = {
  fields,
  indent: 15,
  doc: DEFAULTS_BASE.doc,
  query: DEFAULTS_BASE.query,
  namespace: { title: 'Namespace' },
} as const;

/**
 * Helpers
 */

export const Wrangle = {
  filesTotal(total: number, bytes: number) {
    const totalSuffix = Value.plural(total, 'file', 'files');
    const size = Filesize(bytes);
    return `${total.toLocaleString()} ${totalSuffix}, ${size}`;
  },
};
