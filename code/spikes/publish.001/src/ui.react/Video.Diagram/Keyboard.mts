import { R, t, KeyListener } from '../common';

export const VideoKeyboard = {
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
        const offset = e.metaKey ? -20 : -5;
        await vimeo.seek.offset(offset);
      }
      if (e.key === 'ArrowRight') {
        const offset = e.metaKey ? 20 : 5;
        await vimeo.seek.offset(offset);
      }
    });
  },
};
