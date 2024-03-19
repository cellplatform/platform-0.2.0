import { Canvas } from '.';
import { Dev, DevReload, Pkg, TestDb, type t, COLORS } from '../../test.ui';
import { SampleCrdt } from './-SPEC-crdt';
import { Link } from './-SPEC-ui.Link';
import { CanvasSample } from './-SPEC-ui.Sample';

type T = { props: t.CanvasProps; debug: { reload?: boolean; docuri?: string } };
const initial: T = { props: {}, debug: {} };

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
  type LocalStore = T['debug'] & Pick<t.CanvasProps, 'behaviors' | 'theme'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: undefined,
    behaviors: Canvas.DEFAULTS.behaviors.default,
    docuri: undefined,
  });

  const crdt = await SampleCrdt.init(local.docuri);
  local.docuri = crdt.doc.uri;

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
        if (debug.reload) return <DevReload />;

        Dev.Theme.background(ctx, props.theme);
        const userId = 'foo-1234'; // TEMP 🐷
        return <CanvasSample {...props} doc={crdt.doc} userId={userId} />;
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

    dev.section('State', (dev) => {
      dev.row((e) => crdt?.render({ Margin: [15, 0, 0, 0] }));
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(
        dev,
        (d) => d.props.theme,
        (d, value) => (local.theme = d.props.theme = value),
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());

      dev.hr(-1, 5);

      dev.button([`delete database: "${crdt.storage}"`, '💥'], async (e) => {
        e.state.change((d) => (d.debug.reload = true));
        await TestDb.Spec.deleteDatabase();
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const { props } = e.state;
      const data = {
        props,
        crdt: crdt.doc.current,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
