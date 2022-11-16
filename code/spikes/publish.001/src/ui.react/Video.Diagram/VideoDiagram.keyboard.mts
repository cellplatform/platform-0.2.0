import { t } from '../common';

export const KeyboardMonitor = {
  listen(args: { vimeo: t.VimeoEvents }) {
    const { vimeo } = args;

    const handler = async (e: KeyboardEvent) => {};

    document.addEventListener('keydown', handler);
    return {
      dispose: () => document.removeEventListener('keydown', handler),
    };
  },
};
