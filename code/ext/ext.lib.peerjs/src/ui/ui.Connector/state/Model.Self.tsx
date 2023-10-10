import { COLORS, Icons, State, Time, cuid, slug, type t } from '../common';

export type SelfModelOptions = {
  peerid?: string;
  dispose$?: t.UntilObservable;
};

type D = { copied?: string };

export const SelfModel = {
  /**
   * State wrapper.
   */
  state(options: SelfModelOptions = {}) {
    const { dispose$ } = options;
    const peerid = Wrangle.peerid(options);

    const copyClipboard = async () => {
      await navigator.clipboard.writeText(`peer:${peerid}`);

      const copied = slug();
      state.change((d) => (State.data<D>(d).copied = copied));
      dispatch.redraw();

      Time.delay(1200, () => {
        if (State.data<D>(state.current).copied !== copied) return;
        state.change((d) => (State.data<D>(d).copied = undefined));
        dispatch.redraw();
      });
    };

    const initial: t.ConnectorItem = {
      editable: false,
      placeholder: 'peer id',
      label: peerid,
      left: { kind: 'local:left' },
      right: { kind: 'local:copy' },
    };

    const state = State.item(initial);
    const dispatch = State.commands(state);
    const events = state.events(dispose$);

    events.command.clipboard.copy$.subscribe(copyClipboard);
    events.command.action.kind<t.ConnectorActionKind>('local:copy').subscribe(copyClipboard);

    return state;
  },

  /**
   * Element Renderers
   */
  get renderers(): t.ConnectorItemRenderers {
    return {
      label(e) {
        return <div>{`me:${e.item.label}`}</div>;
      },

      action(kind, helpers) {
        if (kind === 'local:left') {
          return (e) => {
            const color = e.selected ? e.color : COLORS.BLUE;
            return <Icons.Person {...helpers.icon(e, 17)} color={color} />;
          };
        }

        if (kind === 'local:copy') {
          return (e) => {
            if (State.data<D>(e.item).copied) {
              return <Icons.Done {...helpers.icon(e, 18)} tooltip={'Copied'} offset={[0, -1]} />;
            } else {
              return <Icons.Copy {...helpers.icon(e, 16)} tooltip={'Copy to clipboard'} />;
            }
          };
        }

        return;
      },
    };
  },
} as const;

/**
 * Helpers
 */
export const Wrangle = {
  peerid: (options: SelfModelOptions) => options.peerid ?? cuid(),
} as const;
