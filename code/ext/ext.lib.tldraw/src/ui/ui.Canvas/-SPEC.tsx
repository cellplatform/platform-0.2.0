import { Canvas } from '.';
import { Dev, Pkg, type t } from '../../test.ui';
import { Link } from './-SPEC-ui.Link';

type P = t.CanvasProps;
type T = { props: P; debug: {} };
const initial: T = { props: {}, debug: {} };
const DEFAULTS = Canvas.DEFAULTS;

const URLS = {
  docs: 'https://tldraw.dev',
  repo: 'https://github.com/tldraw/tldraw?tab=readme-ov-file',
  automergeTldraw: 'https://github.com/pvh/automerge-tldraw',
  automergeTldrawExample: 'https://github.com/pvh/tldraw-automerge-example',
} as const;

/**
 * Spec
 */
const name = 'Canvas';
export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] & Pick<P, 'behaviors' | 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: undefined,
    behaviors: DEFAULTS.behaviors.default,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.behaviors = local.behaviors;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        Dev.Theme.background(ctx, props.theme);
        return <Canvas {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Reference', (dev) => {
      const link = (title: string, href: string) => {
        dev.row((e) => <Link href={href} title={title} style={{ marginLeft: 8 }} />);
      };
      link('docs:', URLS.docs);
      link('repo:', URLS.repo);
      link('automerge-tldraw', URLS.automergeTldraw);
      link('automerge-tldraw-example', URLS.automergeTldrawExample);
    });

    dev.hr(5, 20);

    dev.TODO('', { margin: [0, 0, 20, 0] });
    dev.row((e) => {
      return (
        <Canvas.Config
          selected={e.state.props.behaviors}
          onChange={(e) => {
            state.change((d) => (d.props.behaviors = e.next));
            local.behaviors = e.next;
          }}
        />
      );
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = { ...e.state };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
