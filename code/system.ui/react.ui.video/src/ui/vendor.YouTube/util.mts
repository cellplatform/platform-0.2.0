import { t, Path } from '../common';
import { DEFAULTS } from './const.mjs';

function parseUrl(input?: string | URL) {
  if (!input) return;
  try {
    return typeof input === 'string' ? new URL(input) : input;
  } catch (error) {
    return undefined;
  }
}

export const Wrangle = {
  /**
   * Extract YouTube props from an input URL.
   */
  fromUrl(input?: string | URL): { href: string; id: string; start?: number } {
    const url = parseUrl(input);
    if (!url) return { href: '', id: '' };
    return {
      href: url.href,
      id: Wrangle.id(url),
      start: Wrangle.start(url),
    };
  },

  /**
   * Extrct the video ID from known YouTube URL formats.
   */
  id(input?: string | URL): string {
    const url = parseUrl(input);
    if (!url) return '';

    if (url.href.startsWith(DEFAULTS.url.watch)) {
      return url.searchParams.get('v') ?? '';
    }
    if (url.href.startsWith(DEFAULTS.url.embed)) {
      return url.pathname.split('/').at(-1) ?? '';
    }
    if (url.href.startsWith(DEFAULTS.url.share)) {
      return Path.trimSlashesStart(url.pathname);
    }
    return '';
  },

  start(input?: string | URL): number | undefined {
    const url = parseUrl(input);
    if (!url) return undefined;

    const params = url.searchParams;
    const value = params.get('start') ?? params.get('t');
    try {
      return value !== null ? parseInt(value) : undefined;
    } catch (error) {
      return undefined;
    }
  },

  /**
   * Convert distinct values into a YouTube embed URL.
   */
  toEmbedUrl(args: t.YouTubeUrlProps) {
    const { start } = args;
    const id = (args.id ?? '').trim();
    if (!id) return undefined;

    const url = new URL(DEFAULTS.url.embed);
    url.pathname = Path.join(url.pathname, id);
    if (typeof start === 'number') url.searchParams.set('start', start.toString());
    return url.href;
  },
};
