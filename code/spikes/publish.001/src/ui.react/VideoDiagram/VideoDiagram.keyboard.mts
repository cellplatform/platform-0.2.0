import { t } from '../common';

export const KeyboardMonitor = {
  listen(args: { vimeo: t.VimeoEvents; setMuted: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { vimeo, setMuted } = args;

    const handler = async (e: KeyboardEvent) => {
      if (e.key === 'm') {
        // COMMAND: Mute|Unmute
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
