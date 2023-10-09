import { State, Hash, Icons, cuid, type t, COLORS, Time, slug } from '../common';

export type SelfModelOptions = {
  peerid?: string;
  dispose$?: t.UntilObservable;
};

export const SelfModel = {
  /**
   * State wrapper.
   */
  state(options: SelfModelOptions = {}) {
    const { dispose$ } = options;

    const peerid = Wrangle.peerid(options);
    const transient = { justCopied: '' };

    const copyClipboard = async () => {
      await navigator.clipboard.writeText(`peer:${peerid}`);

      const justCopied = (transient.justCopied = slug());
      dispatch.redraw();
      Time.delay(1200, () => {
        if (transient.justCopied !== justCopied) return;
        transient.justCopied = '';
        dispatch.redraw();
      });
    };

    const initial: t.LabelItem = {
      is: { editable: false },
      placeholder: 'peer id',

      // label: `me:${Hash.shorten(peerid, [0, 5])}`,
      label: peerid,

      left: {
        kind: 'local:self',
        render(e) {
          return (
            <Icons.Person
              size={17}
              color={e.selected ? e.color : COLORS.BLUE}
              opacity={e.enabled ? 1 : 0.3}
            />
          );
        },
      },

      right: {
        kind: 'local:copy',
        onClick: copyClipboard,
        render(e) {
          if (transient.justCopied) {
            return <Icons.Done size={18} color={e.color} offset={[0, -1]} />;
          }
          return (
            <Icons.Copy
              size={16}
              color={e.color}
              opacity={e.enabled ? 1 : 0.3}
              tooltip={'Copy to clipboard'}
            />
          );
        },
      },
    };

    const state = State.item(initial);
    const dispatch = State.commands(state);
    const events = state.events(dispose$);

    events.command.clipboard.copy$.subscribe((e) => {
      copyClipboard();
    });

    return state;
  },
} as const;

/**
 * Helpers
 */
export const Wrangle = {
  peerid: (options: SelfModelOptions) => options.peerid ?? cuid(),
} as const;
