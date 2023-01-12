import { Path } from '../common';

export const WrangleUrl = {
  /**
   * Convert an input to a standaqrd URL object.
   */
  asUrl(input: URL | string): URL {
    return input instanceof URL ? input : new URL(input);
  },

  /**
   * Match the given path on a URL, and fallback to examining the
   * query-string to see if it's been added after a "/?" to the URL.
   * NOTE:
   *    This is useful for local-dev, where you want to work and test
   *    with paths but do not want to setup a whole server-side routing
   *    structure.
   */
  matchAsPathOrQuery(input: URL | string, ...paths: string[]) {
    const url = WrangleUrl.asUrl(input);
    const params = url.searchParams;

    for (const item of paths) {
      const pathname = `/${Path.trimSlashes(item)}/`;
      if (url.pathname === pathname) return true;

      const qs = decodeURIComponent(params.toString());
      const qspath = qs.substring(0, qs.indexOf('='));
      if (qspath && `/${Path.trimSlashes(qspath)}/` === pathname) return true;
    }

    return false;
  },
};
