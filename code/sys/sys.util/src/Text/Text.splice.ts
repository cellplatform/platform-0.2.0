import { ObjectPath, type t } from './common';

type O = Record<string, unknown>;

/**
 * Safely modify a string stored on a CRDT.
 */
export function splice<T extends O>(
  state: T,
  path: t.ObjectPath,
  index: t.Index,
  del: number,
  newText?: string,
) {
  if (path.length === 0) throw new Error('Target path is empty');
  const target = ObjectPath.resolve<O>(state, path.slice(0, -1));
  const prop = path[path.length - 1];
  if (!target || typeof target !== 'object') {
    throw new Error(`Target path "${path.join('.')}" is not within an object`);
  }
  if (!(target[prop] === undefined || typeof target[prop] === 'string')) {
    throw new Error(`Target path "${path.join('.')}" is not a string`);
  }

  // Perform the splice operation.
  const str = target[prop] ?? '';
  target[prop] = `${str.slice(0, index)}${newText || ''}${str.slice(index + del)}`;
}
