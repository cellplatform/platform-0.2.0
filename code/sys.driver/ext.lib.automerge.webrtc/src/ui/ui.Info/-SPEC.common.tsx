import { Color, Dev, PeerUI, css, type t } from '../../test.ui';

type O = Record<string, unknown>;
type D = { data: DataFlags };

export type DataFlags = {
  sharedLens?: boolean;
  sharedArray?: boolean;
  sharedDotMeta?: boolean;
  sharedObjectVisible?: boolean;
};

/**
 * Common data helpers.
 */
export const SpecData = {
  section(dev: t.DevTools<D>, state: t.ImmutableRef<D>) {
    dev.section('Data', (dev) => {
      dev.boolean((btn) => {
        const current = () => !!state.current.data.sharedLens;
        btn
          .label(() => `shared.lens`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d.data, 'sharedLens')));
      });
      dev.boolean((btn) => {
        const current = () => !!state.current.data.sharedDotMeta;
        btn
          .label(() => `shared.dotMeta`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d.data, 'sharedDotMeta')));
      });
      dev.boolean((btn) => {
        const current = () => !!state.current.data.sharedArray;
        btn
          .label(() => `shared ← [array]`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d.data, 'sharedArray')));
      });
      dev.boolean((btn) => {
        const current = () => !!state.current.data.sharedObjectVisible;
        btn
          .label(() => `shared ← (object visible)`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d.data, 'sharedObjectVisible')));
      });
    });
  },
} as const;

/**
 * Common header helpers.
 */
export const SpecHeader = {
  define(dev: t.DevTools, peer: t.PeerModel) {
    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => <PeerUI.Connector peer={peer} />);
  },
} as const;

/**
 * Common footer helpers.
 */
export const SpecFooter = {
  define(dev: t.DevTools, name: string, peer: t.PeerModel, props: t.ImmutableRef) {
    dev.footer
      .padding(0)
      .border(-0.1)
      .render<D>(() => SpecFooter.render(name, peer, { props: props.current }));
  },

  render(name: string, peer: t.PeerModel, data: O) {
    const styles = {
      base: css({}),
      obj: css({ margin: 8 }),
      conn: css({ borderTop: `solid 1px ${Color.alpha(Color.DARK, 0.1)}` }),
    };
    return (
      <div {...styles.base}>
        <Dev.Object name={name} data={data} expand={1} style={styles.obj} fontSize={11} />
        <PeerUI.Connector peer={peer} style={styles.conn} />
      </div>
    );
  },
} as const;
