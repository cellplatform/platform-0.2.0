import { COLORS, Icons, State, Time, cuid, slug, type t } from '../common';

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
          const tooltip = 'Copy to clipboard';
          return (e) => <Icons.Copy {...helpers.icon(e, 16)} tooltip={tooltip} />;
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
