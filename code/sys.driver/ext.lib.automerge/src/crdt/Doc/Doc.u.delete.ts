import { get } from './Doc.u.get';
import { type t } from './common';

type Uri = t.DocUri | t.UriString;

/**
 * Delete the specified document.
 */
export async function del(args: { repo: t.AutomergeRepo; uri?: Uri; timeout?: t.Msecs }) {
  const { repo, uri, timeout } = args;
  if (!uri) return false;

  const exists = !!(await get({ repo, uri, timeout }));
  if (!exists) return false;

  repo.delete(uri as t.DocUri);
  return true;
}
