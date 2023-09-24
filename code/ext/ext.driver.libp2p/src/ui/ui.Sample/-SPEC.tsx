import { css, Dev, type t, ObjectView } from '../../test.ui';

import { createLibp2p } from 'libp2p';

type T = {};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample:Libp2p';

export default Dev.describe(name, async (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    // const libp2p = await createLibp2p({});

    ctx.debug.width(330);
    ctx.subject
      .backgroundColor(1)
      .size([250, null])
      .display('grid')
      .render<T>((e) => {
        const styles = {
          base: css({ padding: 15 }),
        };

        return (
          <div {...styles.base}>
            <ObjectView data={createLibp2p} />
          </div>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.TODO();
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
