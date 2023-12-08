import { Dev } from '../../test.ui';
import { Link } from './-SPEC.ui.Link';
import { Sample, type SampleProps } from './-SPEC.ui.Sample';

type T = { props: SampleProps };
const initial: T = { props: {} };

const URLS = {
  docs: 'https://tldraw.dev',
  repo: 'https://github.com/tldraw/tldraw?tab=readme-ov-file',
} as const;

/**
 * Spec
 */
const name = 'Sample.01';
export default Dev.describe(name, (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <Sample {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Reference', (dev) => {
      const link = (title: string, href: string) => {
        dev.row((e) => <Link href={href} title={title} style={{ paddingLeft: 8 }} />);
      };
      link('(docs):', URLS.docs);
      link('(repo):', URLS.repo);
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
