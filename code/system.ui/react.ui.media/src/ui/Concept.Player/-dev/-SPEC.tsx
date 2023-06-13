import { Dev } from '../../../test.ui';
import { ConceptPlayer, type ConceptPlayerProps } from '..';

type T = { props: ConceptPlayerProps };
const initial: T = { props: {} };

export default Dev.describe('Concept', (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .size('fill', 100)
      .display('grid')
      .render<T>((e) => {
        return <ConceptPlayer {...e.state.props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.TODO();
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const data = e.state;
      return <Dev.Object name={'Concept'} data={data} expand={1} />;
    });
  });
});
