import { DEFAULTS, type t } from './common';

/**
 * Determing the HTTP origin URL.
 */
export function origin(options: t.DenoHttpOptions = {}) {
  const { forcePublic = false } = options;
  const origins = {
    local: options.origins?.local ?? DEFAULTS.origins.local,
    remote: options.origins?.remote ?? DEFAULTS.origins.remote,
  } as const;

  const isLocalhost = location.hostname === 'localhost';
  const useLocal = isLocalhost && !forcePublic;

  return useLocal ? origins.local : origins.remote;
}
