import { get } from './Doc.u.get';
import { type t } from './common';

type Uri = t.DocUri | string;

/**
 * Delete the specified document.
 */
export async function del(args: { repo: t.Repo; uri?: Uri; timeout?: t.Msecs }) {
  const { repo, uri, timeout } = args;
  if (!uri) return false;

  const exists = !!(await get({ repo, uri, timeout }));
  if (!exists) return false;

  repo.delete(uri as t.DocUri);
  return true;
}
