import { t } from '../common';

export const KeyboardMonitor = {
  listen(args: { vimeo: t.VimeoEvents; setMuted: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { vimeo, setMuted } = args;

    const handler = async (e: KeyboardEvent) => {
      // "M" key command - Mute|Unmute
      if (e.key === 'm') {
        e.preventDefault();
        setMuted((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handler);
    return {
      dispose: () => document.removeEventListener('keydown', handler),
    };
  },
};
