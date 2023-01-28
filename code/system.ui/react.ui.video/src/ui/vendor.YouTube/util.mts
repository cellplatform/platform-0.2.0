import { t, Path } from '../common';
import { DEFAULTS } from './const.mjs';

export const Wrangle = {
  url(input: string | URL) {
    return typeof input === 'string' ? new URL(input) : input;
  },

  /**
   * Extract YouTube props from an input URL.
   */
  fromUrl(input: string | URL) {
    const url = Wrangle.url(input);
    return {
      href: url.href,
      id: Wrangle.id(url),
      start: Wrangle.start(url),
    };
  },

  /**
   * Extrct the video ID from known YouTube URL formats.
   */
  id(input: string | URL): string {
    const url = Wrangle.url(input);
    if (url.href.startsWith(DEFAULTS.url.embed)) {
      return url.pathname.split('/').at(-1) ?? '';
    }
    if (url.href.startsWith(DEFAULTS.url.share)) {
      return Path.trimSlashesStart(url.pathname);
    }
    return '';
  },

  start(input: string | URL): number | undefined {
    const params = Wrangle.url(input).searchParams;
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
