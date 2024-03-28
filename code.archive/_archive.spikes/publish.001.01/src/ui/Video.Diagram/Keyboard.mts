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
        /**
         * NOTE: 🐷 Supress the "To End" (META+[→]) action.
         * Until it can be instantly (eager ui-rendering) of the end-state on the progress bar
         */
        // await (e.metaKey ? vimeo.seek.end() : vimeo.seek.offset(Wrangle.offset(e)));
        await vimeo.seek.offset(Wrangle.offset(e));
      }
    });
  },
};

/**
 * [Helpers]
 */

const Wrangle = {
  offset(e: KeyboardEvent) {
    if (e.shiftKey && e.altKey) return 30;
    if (e.shiftKey) return 10;
    return 3;
  },
};
