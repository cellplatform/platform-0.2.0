import { Canvas } from '.';
import { Dev, Pkg, type t } from '../../test.ui';
import { Link } from './-SPEC.ui.Link';

type T = { props: t.CanvasProps };
const initial: T = { props: {} };

const URLS = {
  docs: 'https://tldraw.dev',
  repo: 'https://github.com/tldraw/tldraw?tab=readme-ov-file',
} as const;

/**
 * Spec
 */
const name = 'Canvas';
export default Dev.describe(name, (e) => {
  type LocalStore = Pick<t.CanvasProps, 'behaviors'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    behaviors: Canvas.DEFAULTS.behaviors.default,
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {
      d.props.behaviors = local.behaviors;
    });

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Canvas {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Reference', (dev) => {
      const link = (title: string, href: string) => {
        dev.row((e) => <Link href={href} title={title} style={{ marginLeft: 8 }} />);
      };
      link('(docs):', URLS.docs);
      link('(repo):', URLS.repo);
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
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
