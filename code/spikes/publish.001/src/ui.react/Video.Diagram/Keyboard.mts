import { t, KeyListener } from '../common';

export const VideoDiagramKeyboard = {
  listen(vimeo: t.VimeoEvents) {
    return KeyListener.keydown(async (e) => {
      /**
       * CMD+<Space>  |->  Start/Stop
       */
      if (e.key === ' ') {
        await vimeo.play.toggle();
      }

      /**
       * Arrow Keys  |->  Skip
       */
      if (e.key === 'ArrowLeft') {
        await (e.metaKey ? vimeo.seek.start() : vimeo.seek.offset(0 - Wrangle.offset(e)));
      }
      if (e.key === 'ArrowRight') {
        await (e.metaKey ? vimeo.seek.end() : vimeo.seek.offset(Wrangle.offset(e)));
      }
    });
  },
};

/**
 * [Helpers]
 */

const Wrangle = {
  offset(e: KeyboardEvent) {
    if (e.altKey && e.shiftKey) return 30;
    if (e.altKey) return 10;
    return 3;
  },
};
