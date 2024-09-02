import { get } from './Doc.u.get';
import { type t } from './common';

/**
 * Delete the specified document.
 */
export async function del(args: { repo: t.AutomergeRepo; uri?: t.UriString; timeout?: t.Msecs }) {
  const { repo, uri, timeout } = args;
  if (!uri) return false;

  const exists = !!(await get({ repo, uri, timeout }));
  if (!exists) return false;

  repo.delete(uri as t.AutomergeUrl);
  return true;
}
