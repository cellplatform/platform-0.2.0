type O = Record<string, unknown>;

/**
 * A URL helper.
 */
export function url(href: string | URL, params?: O) {}

/**
 * A URL helpers scoped to a single hostname.
 */
export function host(host: string) {
  return {
    host,
    path(path: string, params?: O) {},
  } as const;
}
