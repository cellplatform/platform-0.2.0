import { DEFAULTS, Time, slug, type t } from './common';
import { Data } from './u.Data';

export const State = {
  /**
   * Set a transient display message (eg "copied").
   */
  message: {
    /**
     * Write the message.
     */
    set(
      item: t.RepoItemModel,
      text: string,
      options: { delay?: t.Msecs; icon?: t.RepoItemDataMessage['icon'] } = {},
    ) {
      const { icon, delay = DEFAULTS.timeout.message } = options;
      const timer = Time.action(delay).on('complete', () => {
        if (!State.message.isCurrent(item, tx)) return; // NB: a newer message has been written.
        clear();
      });

      const clear = () => {
        timer.reset();
        State.message.clear(item, tx);
      };

      timer.start();
      const tx = slug();
      item.state.change((d) => (Data.item(d).message = { tx, text, icon }));
      item.dispatch.redraw();
      return { tx, clear } as const;
    },

    /**
     * Remove the message.
     */
    clear(item: t.RepoItemModel, tx: string) {
      if (!State.message.isCurrent(item, tx)) return; // NB: a newer message has been written.
      item.state.change((d) => delete Data.item(d).message);
      item.dispatch.redraw();
    },

    isCurrent(item: t.RepoItemModel, tx: string) {
      return Data.item(item).message?.tx === tx;
    },
  },
} as const;
